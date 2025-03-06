#!/bin/bash

# Default AWS profile
DEFAULT_PROFILE="tpm-tools-pprod"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --profile)
            AWS_PROFILE="$2"
            shift
            shift
            ;;
        --force)
            FORCE_DEPLOY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Use default profile if none specified
AWS_PROFILE=${AWS_PROFILE:-$DEFAULT_PROFILE}

# Set parameters
S3_BUCKET="contently-brand-compass-poc"
STACK_NAME="contently-brand-compass"
REGION="us-east-1"
BASTION_URL="https://6urycyn3yfnkb5nxgr2vnkt3xu0cufot.lambda-url.us-east-1.on.aws/"

echo "Using AWS Profile: $AWS_PROFILE"
echo "Stack Name: $STACK_NAME"
echo "Bastion URL: $BASTION_URL"

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

# Build and deploy SAM application
echo "Building SAM application..."
sam build

# Prepare deploy command
DEPLOY_CMD="sam deploy \
    --template-file .aws-sam/build/template.yaml \
    --stack-name \"$STACK_NAME\" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \"S3BucketName=$S3_BUCKET\" \"BastionFunctionUrl=$BASTION_URL\" \
    --profile \"$AWS_PROFILE\" \
    --region \"$REGION\" \
    --resolve-s3 \
    --no-confirm-changeset \
    --no-fail-on-empty-changeset"

# Add force-upload if specified
if [ "$FORCE_DEPLOY" = true ]; then
    echo "Forcing deployment..."
    DEPLOY_CMD="$DEPLOY_CMD --force-upload"
fi

echo "Deploying SAM application..."
eval "$DEPLOY_CMD"

echo "SAM deployment complete!"

# Get and display outputs
echo "Getting stack outputs..."
API_URL=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query 'Stacks[0].Outputs[?OutputKey==`BrandCompassApiUrl`].OutputValue' \
    --output text \
    --profile "$AWS_PROFILE" \
    --region "$REGION")

S3_URL="http://$S3_BUCKET.s3-website-$REGION.amazonaws.com"

# Output in a format that can be easily parsed
echo "SAM_OUTPUTS_START"
echo "API_URL=$API_URL"
echo "S3_URL=$S3_URL"
echo "SAM_OUTPUTS_END"
