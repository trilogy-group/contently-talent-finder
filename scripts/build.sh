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
        --bastion)
            BASTION=true
            shift
            ;;
        --proxy)
            PROXY=true
            shift
            ;;
        --frontend)
            FRONTEND=true
            shift
            ;;
        --force)
            FORCE_DEPLOY=true
            shift
            ;;
        *)
            echo "Unknown option: $1"
            echo "Usage: $0 [--bastion] [--proxy] [--frontend] [--force] [--profile PROFILE]"
            exit 1
            ;;
    esac
done

# Use default profile if none specified
AWS_PROFILE=${AWS_PROFILE:-$DEFAULT_PROFILE}

# Get the directory of this script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Make scripts executable
chmod +x "$SCRIPT_DIR/create_bastion.sh"
chmod +x "$SCRIPT_DIR/sam_build.sh"
chmod +x "$SCRIPT_DIR/react_build.sh"

# If no specific component is selected, build all
if [ -z "$BASTION" ] && [ -z "$PROXY" ] && [ -z "$FRONTEND" ]; then
    BASTION=true
    PROXY=true
    FRONTEND=true
fi

# Deploy bastion if requested
if [ "$BASTION" = true ]; then
    echo "Deploying bastion lambda..."
    BASTION_CMD="$SCRIPT_DIR/create_bastion.sh --profile contently-prod"
    if [ "$FORCE_DEPLOY" = true ]; then
        BASTION_CMD="$BASTION_CMD --force"
    fi
    eval "$BASTION_CMD"
fi

# Deploy proxy if requested
if [ "$PROXY" = true ]; then
    echo "Deploying proxy lambda and API Gateway..."
    # Prepare SAM command
    SAM_CMD="$SCRIPT_DIR/sam_build.sh --profile \"$AWS_PROFILE\""
    if [ "$FORCE_DEPLOY" = true ]; then
        SAM_CMD="$SAM_CMD --force"
    fi
    
    # Capture SAM build output while also showing it
    SAM_OUTPUT=$(eval "$SAM_CMD" | tee /dev/tty)
    
    # Parse URLs from SAM output
    API_URL=$(echo "$SAM_OUTPUT" | awk '/^API_URL=/{print substr($0, 9)}')
    S3_URL=$(echo "$SAM_OUTPUT" | awk '/^S3_URL=/{print substr($0, 8)}')
    
    if [ -z "$API_URL" ] || [ -z "$S3_URL" ]; then
        echo "Error: Failed to get URLs from SAM build"
        exit 1
    fi
fi

# Deploy frontend if requested
if [ "$FRONTEND" = true ]; then
    echo "Deploying React frontend..."
    if [ -z "$API_URL" ]; then
        # If we didn't deploy proxy, we need to get the URLs from the existing stack
        STACK_NAME="contently-brand-compass"
        REGION="us-east-1"
        S3_BUCKET="contently-brand-compass-poc"
        
        API_URL=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME" \
            --query 'Stacks[0].Outputs[?OutputKey==`BrandCompassApiUrl`].OutputValue' \
            --output text \
            --profile "$AWS_PROFILE" \
            --region "$REGION")
        
        S3_URL="http://$S3_BUCKET.s3-website-$REGION.amazonaws.com"
    fi
    
    "$SCRIPT_DIR/react_build.sh" --profile "$AWS_PROFILE" --api-url "$API_URL" --s3-url "$S3_URL"
fi
