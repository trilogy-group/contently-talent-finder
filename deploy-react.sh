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

echo "Using AWS Profile: $AWS_PROFILE"

# Try to create bucket (will fail if it exists, that's ok)
echo "Creating S3 bucket if it doesn't exist..."
aws s3 mb "s3://$S3_BUCKET" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" || true

# Disable block public access
echo "Configuring bucket public access..."
aws s3api put-public-access-block \
    --bucket "$S3_BUCKET" \
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false" \
    --profile "$AWS_PROFILE" || true

# Create environment file with API Gateway URL
API_URL="https://udbdh62m4i.execute-api.us-east-1.amazonaws.com"
echo "Creating environment file with API URL: $API_URL"
cat > .env <<EOF
VITE_API_ENDPOINT=$API_URL
EOF

echo "Building React application..."
npm install && npm run build

echo "Configuring S3 bucket for static website hosting..."
aws s3 website "s3://$S3_BUCKET" --index-document index.html --error-document index.html \
    --profile "$AWS_PROFILE" || true

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
rm bucket-policy.json

echo "Deploying React application to S3..."
aws s3 sync dist/ "s3://$S3_BUCKET" \
    --profile "$AWS_PROFILE"

echo "Website URL: http://$S3_BUCKET.s3-website-$REGION.amazonaws.com"
