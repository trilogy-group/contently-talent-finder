#!/bin/bash
set -e

# Default configuration
REGION="us-east-1"
AWS_PROFILE="contently-prod"

# Function to show help
show_help() {
    echo "Usage: $0 [options]"
    echo "Manage secrets for the database proxy Lambda function"
    echo ""
    echo "Options:"
    echo "  --environment ENV       Environment to deploy to (staging, prod, poc)"
    echo "  --secret-name NAME      Name of the secret in Secrets Manager"
    echo "  --password PASSWORD     Password to store in the secret"
    echo "  --profile PROFILE       AWS profile to use (default: contently-prod)"
    echo "  --region REGION         AWS region to deploy to (default: us-east-1)"
    echo "  --help                  Show this help message"
    echo ""
    echo "Example:"
    echo "  $0 --environment poc --secret-name contently/database/credentials --password mypassword"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        --secret-name)
            SECRET_NAME="$2"
            shift 2
            ;;
        --password)
            PASSWORD="$2"
            shift 2
            ;;
        --profile)
            AWS_PROFILE="$2"
            shift 2
            ;;
        --region)
            REGION="$2"
            shift 2
            ;;
        --help)
            show_help
            ;;
        *)
            echo "Unknown option: $1"
            show_help
            ;;
    esac
done

# Validate required parameters
if [ -z "$ENVIRONMENT" ] || [ -z "$SECRET_NAME" ] || [ -z "$PASSWORD" ]; then
    echo "Error: Missing required parameters"
    show_help
fi

# Create JSON content for the secret
if [ "$ENVIRONMENT" == "poc" ]; then
    SECRET_CONTENT="{\"poc_password\": \"$PASSWORD\", \"staging_password\": \"$PASSWORD\"}"
elif [ "$ENVIRONMENT" == "prod" ]; then
    SECRET_CONTENT="{\"prod_password\": \"$PASSWORD\", \"staging_password\": \"$PASSWORD\"}"
else
    SECRET_CONTENT="{\"staging_password\": \"$PASSWORD\"}"
fi

# Check if secret exists
SECRET_ARN=$(aws secretsmanager describe-secret \
    --secret-id "$SECRET_NAME" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" \
    --query 'ARN' \
    --output text 2>/dev/null || echo "")

if [ -z "$SECRET_ARN" ]; then
    # Create new secret
    echo "Creating new secret $SECRET_NAME..."
    aws secretsmanager create-secret \
        --name "$SECRET_NAME" \
        --description "Database credentials for $ENVIRONMENT environment" \
        --secret-string "$SECRET_CONTENT" \
        --profile "$AWS_PROFILE" \
        --region "$REGION"
else
    # Update existing secret
    echo "Updating existing secret $SECRET_NAME..."
    aws secretsmanager update-secret \
        --secret-id "$SECRET_NAME" \
        --secret-string "$SECRET_CONTENT" \
        --profile "$AWS_PROFILE" \
        --region "$REGION"
fi

echo "Secret $SECRET_NAME has been created/updated for environment $ENVIRONMENT"
