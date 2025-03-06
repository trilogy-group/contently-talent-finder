#!/bin/bash

# Default AWS profile
DEFAULT_PROFILE="tpm-tools-pprod"

# Parse command line arguments
DEPLOY_BASTION_ONLY=false
while [[ "$#" -gt 0 ]]; do
    case $1 in
        --bastion) DEPLOY_BASTION_ONLY=true ;;
        --profile)
            AWS_PROFILE="$2"
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
STACK_NAME=${STACK_NAME:-"contently-brand-compass"}
BASTION_STACK_NAME=${BASTION_STACK_NAME:-"tpm-tools-db-proxy"}
S3_BUCKET=${S3_BUCKET:-"contently-brand-compass-poc"}

# Deploy bastion lambda
echo "Deploying bastion lambda..."
(cd ./bastion-lambda && ./deploy.sh)
BASTION_DEPLOY_STATUS=$?
if [ $BASTION_DEPLOY_STATUS -ne 0 ]; then
    echo "Error: Bastion lambda deployment failed"
    exit 1
fi

# Get bastion function info from stack outputs
BASTION_STACK_NAME="tpm-tools-db-proxy-staging"
BASTION_OUTPUTS=$(aws cloudformation describe-stacks \
    --stack-name "$BASTION_STACK_NAME" \
    --profile contently-prod \
    --region us-east-1 \
    --query 'Stacks[0].Outputs' \
    --output json)

BASTION_FUNCTION_NAME=$(echo "$BASTION_OUTPUTS" | jq -r '.[] | select(.OutputKey=="BastionFunctionName") | .OutputValue')
BASTION_FUNCTION_ARN=$(echo "$BASTION_OUTPUTS" | jq -r '.[] | select(.OutputKey=="BastionFunctionArn") | .OutputValue')
BASTION_URL=$(echo "$BASTION_OUTPUTS" | jq -r '.[] | select(.OutputKey=="BastionFunctionUrl") | .OutputValue' | sed 's/https:\/\///')

# Print bastion function info
echo "Bastion Function Info:"
echo "  Name: $BASTION_FUNCTION_NAME"
echo "  URL:  https://$BASTION_URL"

# Exit if only deploying bastion
if [ "$DEPLOY_BASTION_ONLY" = true ]; then
    exit 0
fi

echo "Using AWS Profile: $AWS_PROFILE"
echo "Stack Name: $STACK_NAME"

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

# Build SAM application
echo "Building SAM application..."
(cd proxy-lambda && sam build \
    --template-file template.yaml \
    --parameter-overrides \
        "S3BucketName=$S3_BUCKET" \
        "BastionFunctionArn=$BASTION_FUNCTION_ARN" \
        "BastionFunctionUrl=$BASTION_URL")

echo "Deploying SAM application..."
(cd proxy-lambda && sam deploy \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        "S3BucketName=$S3_BUCKET" \
        "BastionFunctionArn=$BASTION_FUNCTION_ARN" \
        "BastionFunctionUrl=$BASTION_URL" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" \
    --resolve-s3 \
    --no-fail-on-empty-changeset \
    --no-confirm-changeset)

echo "Deployment complete!"

# Get stack outputs
echo "Getting stack outputs..."
STACK_OUTPUTS=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs' \
    --output json)

# Create frontend environment file with API Gateway URL
API_URL="https://udbdh62m4i.execute-api.us-east-1.amazonaws.com"
echo "Creating frontend environment file with API URL: $API_URL"
cat > frontend/.env <<EOF
VITE_API_ENDPOINT=$API_URL
EOF

echo "Building React application..."
(cd frontend && npm install && npm run build)

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
aws s3 sync frontend/dist/ "s3://$S3_BUCKET" \
    --profile "$AWS_PROFILE"

echo "Website URL: http://$S3_BUCKET.s3-website-$REGION.amazonaws.com"
