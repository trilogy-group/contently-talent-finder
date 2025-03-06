#!/bin/bash

# Default AWS profile
DEFAULT_PROFILE="tpm-tools-pprod"

# Parse command line arguments
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --profile)
            AWS_PROFILE="$2"
            shift
            shift
            ;;
        --bucket)
            S3_BUCKET="$2"
            shift
            shift
            ;;
        --cloudfront)
            USE_CLOUDFRONT=true
            shift
            ;;
        --api-url)
            API_URL="$2"
            shift
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        *) echo "Unknown parameter: $1"; exit 1 ;;
    esac
    shift
done

# Use default profile if none specified
AWS_PROFILE=${AWS_PROFILE:-$DEFAULT_PROFILE}

# Set parameters
AWS_PROFILE=${AWS_PROFILE:-"tpm-tools-pprod"}
REGION=${REGION:-"us-east-1"}
S3_BUCKET=${S3_BUCKET:-"contently-talent-finder-poc"}
API_URL=${API_URL:-"https://udbdh62m4i.execute-api.us-east-1.amazonaws.com"}
USE_CLOUDFRONT=${USE_CLOUDFRONT:-false}

echo "Using AWS Profile: $AWS_PROFILE"
echo "S3 Bucket: $S3_BUCKET"
echo "API URL: $API_URL"
echo "Using CloudFront: $USE_CLOUDFRONT"

# Try to create bucket (will fail if it exists, that's ok)
echo "Creating S3 bucket if it doesn't exist..."
aws s3 mb "s3://$S3_BUCKET" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" || true

if [ "$USE_CLOUDFRONT" = true ]; then
    echo "Setting up for CloudFront distribution..."
    
    # Create OAI (Origin Access Identity) for CloudFront
    echo "Creating CloudFront Origin Access Identity..."
    OAI_RESULT=$(aws cloudfront create-cloud-front-origin-access-identity \
        --cloud-front-origin-access-identity-config CallerReference=$(date +%s),Comment="OAI for $S3_BUCKET" \
        --profile "$AWS_PROFILE" \
        --output json)

    OAI_ID=$(echo $OAI_RESULT | jq -r '.CloudFrontOriginAccessIdentity.Id')
    
    echo "Created OAI with ID: $OAI_ID"

    # Update bucket policy to allow CloudFront OAI access
    echo "Updating bucket policy to allow CloudFront access..."
    cat > bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CloudFrontAccess",
            "Effect": "Allow",
            "Principal": {
                "Service": "cloudfront.amazonaws.com"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3_BUCKET/*",
            "Condition": {
                "StringEquals": {
                    "AWS:SourceArn": "arn:aws:cloudfront::$(aws sts get-caller-identity --profile $AWS_PROFILE --query 'Account' --output text):distribution/*"
                }
            }
        }
    ]
}
EOF

    aws s3api put-bucket-policy \
        --bucket "$S3_BUCKET" \
        --policy file://bucket-policy.json \
        --profile "$AWS_PROFILE" || true
else
    # Disable block public access for standard S3 website hosting
    echo "Configuring bucket public access..."
    aws s3api put-public-access-block \
        --bucket "$S3_BUCKET" \
        --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
        --profile "$AWS_PROFILE" || true
        
    # Configure S3 bucket for static website hosting
    echo "Configuring S3 bucket for static website hosting..."
    aws s3 website "s3://$S3_BUCKET" --index-document index.html --error-document index.html \
        --profile "$AWS_PROFILE" || true

    # Set bucket policy for public read access
    echo "Setting bucket policy for public read access..."
    cat > bucket-policy.json <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$S3_BUCKET/*"
        }
    ]
}
EOF
    aws s3api put-bucket-policy \
        --bucket "$S3_BUCKET" \
        --policy file://bucket-policy.json \
        --profile "$AWS_PROFILE" || true
fi

# Create environment file with API Gateway URL
echo "Creating environment file with API URL: $API_URL"
cat > .env <<EOF
VITE_API_ENDPOINT=$API_URL
EOF

if [ "$SKIP_BUILD" != true ]; then
    echo "Building React application..."
    npm install && npm run build
else
    echo "Skipping build step..."
fi

# Deploy the application
echo "Deploying React application to S3..."
aws s3 sync dist/ "s3://$S3_BUCKET" \
    --profile "$AWS_PROFILE"

# Set up CloudFront if requested
if [ "$USE_CLOUDFRONT" = true ]; then
    echo "Creating CloudFront distribution..."
    DISTRIBUTION_CONFIG=$(cat <<EOF
{
    "CallerReference": "$(date +%s)",
    "Aliases": {
        "Quantity": 0
    },
    "DefaultRootObject": "index.html",
    "Origins": {
        "Quantity": 1,
        "Items": [
            {
                "Id": "S3-$S3_BUCKET",
                "DomainName": "$S3_BUCKET.s3.amazonaws.com",
                "OriginPath": "",
                "CustomHeaders": {
                    "Quantity": 0
                },
                "S3OriginConfig": {
                    "OriginAccessIdentity": "origin-access-identity/cloudfront/$OAI_ID"
                }
            }
        ]
    },
    "DefaultCacheBehavior": {
        "TargetOriginId": "S3-$S3_BUCKET",
        "ViewerProtocolPolicy": "redirect-to-https",
        "AllowedMethods": {
            "Quantity": 2,
            "Items": [
                "GET",
                "HEAD"
            ],
            "CachedMethods": {
                "Quantity": 2,
                "Items": [
                    "GET",
                    "HEAD"
                ]
            }
        },
        "SmoothStreaming": false,
        "Compress": true,
        "LambdaFunctionAssociations": {
            "Quantity": 0
        },
        "FieldLevelEncryptionId": "",
        "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6"
    },
    "CacheBehaviors": {
        "Quantity": 0
    },
    "CustomErrorResponses": {
        "Quantity": 1,
        "Items": [
            {
                "ErrorCode": 404,
                "ResponsePagePath": "/index.html",
                "ResponseCode": "200",
                "ErrorCachingMinTTL": 10
            }
        ]
    },
    "Comment": "Distribution for $S3_BUCKET",
    "Logging": {
        "Enabled": false,
        "IncludeCookies": false,
        "Bucket": "",
        "Prefix": ""
    },
    "PriceClass": "PriceClass_100",
    "Enabled": true,
    "ViewerCertificate": {
        "CloudFrontDefaultCertificate": true,
        "MinimumProtocolVersion": "TLSv1",
        "CertificateSource": "cloudfront"
    },
    "Restrictions": {
        "GeoRestriction": {
            "RestrictionType": "none",
            "Quantity": 0
        }
    },
    "WebACLId": "",
    "HttpVersion": "http2",
    "IsIPV6Enabled": true
}
EOF
)

    echo "$DISTRIBUTION_CONFIG" > distribution-config.json

    DISTRIBUTION_RESULT=$(aws cloudfront create-distribution \
        --distribution-config file://distribution-config.json \
        --profile "$AWS_PROFILE" \
        --output json)

    DISTRIBUTION_ID=$(echo $DISTRIBUTION_RESULT | jq -r '.Distribution.Id')
    DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_RESULT | jq -r '.Distribution.DomainName')

    echo "Created CloudFront distribution with ID: $DISTRIBUTION_ID"
    echo "CloudFront domain: $DISTRIBUTION_DOMAIN"
    echo "Your application will be available at: https://$DISTRIBUTION_DOMAIN"
    echo "IMPORTANT: It may take up to 15 minutes for the CloudFront distribution to deploy."
    
    # Clean up temporary files
    rm distribution-config.json
else
    echo "Website URL: http://$S3_BUCKET.s3-website-$REGION.amazonaws.com"
    echo "NOTE: Speech recognition will not work over HTTP. Use --cloudfront option for HTTPS support."
fi

# Clean up
rm bucket-policy.json

echo "Deployment complete!"
