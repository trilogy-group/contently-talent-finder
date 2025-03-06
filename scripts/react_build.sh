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
        --api-url)
            API_URL="$2"
            shift
            shift
            ;;
        --s3-url)
            S3_URL="$2"
            shift
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

# Verify required parameters
if [ -z "$API_URL" ] || [ -z "$S3_URL" ]; then
    echo "Error: --api-url and --s3-url are required"
    exit 1
fi

# Set parameters
S3_BUCKET="contently-brand-compass-poc"
REGION="us-east-1"

# Create .env file for React build
echo "Creating .env file for React build..."
cat > frontend/.env << EOL
VITE_API_URL=$API_URL
VITE_S3_URL=$S3_URL
EOL

# Build React application
echo "Building React application..."
cd frontend
npm install
npm run build
cd ..

# Configure S3 bucket for static website hosting
echo "Configuring S3 bucket for static website hosting..."
aws s3api put-bucket-website \
    --bucket "$S3_BUCKET" \
    --website-configuration "{\"IndexDocument\":{\"Suffix\":\"index.html\"},\"ErrorDocument\":{\"Key\":\"index.html\"}}" \
    --profile "$AWS_PROFILE" || true

# Set bucket policy for public read access
echo "Setting bucket policy for public read access..."
BUCKET_POLICY="{\"Version\":\"2012-10-17\",\"Statement\":[{\"Sid\":\"PublicReadGetObject\",\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":[\"s3:GetObject\",\"s3:ListBucket\"],\"Resource\":[\"arn:aws:s3:::$S3_BUCKET/*\",\"arn:aws:s3:::$S3_BUCKET\"]}]}"

aws s3api put-bucket-policy \
    --bucket "$S3_BUCKET" \
    --policy "$BUCKET_POLICY" \
    --profile "$AWS_PROFILE" || true

# Deploy React application to S3
echo "Deploying React application to S3..."
aws s3 sync frontend/dist/ "s3://$S3_BUCKET/" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" \
    --delete

echo "React deployment complete!"
echo "Website URL: $S3_URL"
