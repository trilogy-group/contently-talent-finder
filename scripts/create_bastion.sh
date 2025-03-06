#!/bin/bash

# Exit on error
set -e

# Default AWS profile
PROFILE="contently-prod"

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --profile)
      PROFILE="$2"
      shift 2
      ;;
    --force)
      FORCE=true
      shift
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

echo "Using AWS Profile: $PROFILE"
echo "Deploying bastion lambda..."

# Change to bastion-lambda directory
cd "$(dirname "$0")/../bastion-lambda"

# Run deploy script with profile
AWS_PROFILE=$PROFILE ./deploy.sh ${FORCE:+--force}
