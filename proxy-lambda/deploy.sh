#!/bin/bash
set -e

# Configuration
STACK_NAME="contently-brand-compass-staging-v2"
REGION="us-east-1"
AWS_PROFILE="tpm-tools-pprod"
S3_BUCKET="contently-brand-compass-poc"

# Get the bastion function name
BASTION_FUNCTION_NAME=$(aws lambda list-functions --profile contently-prod | jq -r '.Functions[] | select(.FunctionName | startswith("tpm-tools-db-proxy-stagin-ContentlyBrandCompassPoc-")) | .FunctionArn')

# Build and deploy
echo "Building SAM application..."
sam build

echo "Deploying SAM application..."
sam deploy \
    --stack-name "$STACK_NAME" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        "S3BucketName=$S3_BUCKET" \
        "BastionFunctionName=$BASTION_FUNCTION_NAME" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" \
    --resolve-s3 \
    --no-confirm-changeset \
    --no-fail-on-empty-changeset
