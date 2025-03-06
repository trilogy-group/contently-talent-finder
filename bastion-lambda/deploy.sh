#!/bin/bash
set -e

# Default configuration
REGION="us-east-1"
AWS_PROFILE="contently-prod"  
BUILD=${BUILD:-true}  # Default to true if not set

# Default to staging environment if not specified
ENVIRONMENT="staging"

# Default database configuration (will be overridden by environment-specific settings)
DB_HOST="platform-staging.ccj8gejueyfv.us-east-1.rds.amazonaws.com"
DB_NAME="contently"
DB_USER="contently_readonly"
SECRET_NAME="contently/database/credentials"
READ_ONLY="true"  # Default to read-only mode

# Default network configuration (will be overridden by environment-specific settings)
VPC_ID="vpc-27f51d5e"  # Default staging VPC
SUBNET_1="subnet-c328edef"  # Default staging subnet 1
SUBNET_2="subnet-b256e0fa"  # Default staging subnet 2
SECURITY_GROUP="sg-0d9f4c4f53e2f614e"  # Default staging security group

CONTENTLY_URL="https://qa3.contently.xyz"
TPM_TOOLS_ACCOUNT_ID="253949037832"

# Function to check if source files have changed
check_for_changes() {
    # Store current state of source files and requirements
    if [ ! -f .previous_state ]; then
        touch .previous_state
    fi
    current_state=$(find src/ template.yaml requirements.txt deploy.sh -type f -exec md5sum {} \; | sort)
    previous_state=$(cat .previous_state)

    if [ "$current_state" != "$previous_state" ]; then
        echo "$current_state" > .previous_state
        return 0  # Changes detected
    else
        return 1  # No changes
    fi
}

# Function to check if VPC endpoint exists
check_vpc_endpoint() {
    local service_name=$1
    aws ec2 describe-vpc-endpoints \
        --filters "Name=vpc-id,Values=$VPC_ID" "Name=service-name,Values=com.amazonaws.$REGION.$service_name" \
        --query 'VpcEndpoints[0].VpcEndpointId' \
        --output text \
        --profile "$AWS_PROFILE" \
        --region "$REGION"
}

# Function to create VPC endpoint
create_vpc_endpoint() {
    local service_name=$1
    echo "Creating $service_name VPC endpoint..."
    aws ec2 create-vpc-endpoint \
        --vpc-id "$VPC_ID" \
        --vpc-endpoint-type Interface \
        --service-name "com.amazonaws.$REGION.$service_name" \
        --subnet-ids "$SUBNET_1" "$SUBNET_2" \
        --security-group-ids "$SECURITY_GROUP" \
        --private-dns-enabled \
        --profile "$AWS_PROFILE" \
        --region "$REGION" \
        --output text \
        --query 'VpcEndpoint.VpcEndpointId'
}

# Function to delete VPC endpoint
delete_vpc_endpoint() {
    local endpoint_id=$1
    echo "Deleting VPC endpoint $endpoint_id..."
    aws ec2 delete-vpc-endpoints \
        --vpc-endpoint-ids "$endpoint_id" \
        --profile "$AWS_PROFILE" \
        --region "$REGION"
}

# Function to delete the stack and cleanup
cleanup() {
    echo "Starting cleanup..."
    
    # Delete CloudFormation stack
    echo "Deleting CloudFormation stack..."
    aws cloudformation delete-stack \
        --stack-name "tpm-tools-db-proxy-$ENVIRONMENT" \
        --profile "$AWS_PROFILE" \
        --region "$REGION"
    
    # Wait for stack deletion
    echo "Waiting for stack deletion..."
    aws cloudformation wait stack-delete-complete \
        --stack-name "tpm-tools-db-proxy-$ENVIRONMENT" \
        --profile "$AWS_PROFILE" \
        --region "$REGION"
    
    # Check and delete VPC endpoint
    local endpoint_id=$(check_vpc_endpoint "secretsmanager")
    if [ "$endpoint_id" != "None" ] && [ -n "$endpoint_id" ]; then
        delete_vpc_endpoint "$endpoint_id"
    fi
    
    local endpoint_id=$(check_vpc_endpoint "servicediscovery")
    if [ "$endpoint_id" != "None" ] && [ -n "$endpoint_id" ]; then
        delete_vpc_endpoint "$endpoint_id"
    fi
    
    echo "Cleanup complete!"
    exit 0
}

# Display help information
show_help() {
    echo "Usage: $0 [options]"
    echo "Options:"
    echo "  --environment ENV    Set the environment (staging, prod, poc)"
    echo "  --db-host HOST       Set the database host"
    echo "  --db-name NAME       Set the database name"
    echo "  --db-user USER       Set the database user"
    echo "  --secret-name NAME   Set the secret name"
    echo "  --vpc-id ID          Set the VPC ID"
    echo "  --subnet-1 ID        Set the first subnet ID"
    echo "  --subnet-2 ID        Set the second subnet ID"
    echo "  --security-group ID  Set the security group ID"
    echo "  --read-only BOOL     Set to 'true' for read-only mode, 'false' for write access (default: true)"
    echo "  --delete             Delete the stack and clean up resources"
    echo "  --force              Force deployment even if no changes detected"
    echo "  --help               Show this help message"
    exit 0
}

# Parse command line arguments
FORCE=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --environment)
            ENVIRONMENT="$2"
            shift
            shift
            ;;
        --db-host)
            DB_HOST="$2"
            shift
            shift
            ;;
        --db-name)
            DB_NAME="$2"
            shift
            shift
            ;;
        --db-user)
            DB_USER="$2"
            shift
            shift
            ;;
        --secret-name)
            SECRET_NAME="$2"
            shift
            shift
            ;;
        --vpc-id)
            VPC_ID="$2"
            shift
            shift
            ;;
        --subnet-1)
            SUBNET_1="$2"
            shift
            shift
            ;;
        --subnet-2)
            SUBNET_2="$2"
            shift
            shift
            ;;
        --security-group)
            SECURITY_GROUP="$2"
            shift
            shift
            ;;
        --read-only)
            READ_ONLY="$2"
            shift
            shift
            ;;
        --delete)
            cleanup
            ;;
        --force)
            FORCE=true
            shift
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

# Set environment-specific configurations
case $ENVIRONMENT in
    "staging")
        # Staging environment settings
        if [ "$VPC_ID" == "vpc-27f51d5e" ]; then
            # Only set defaults if user hasn't overridden them
            VPC_ID="vpc-27f51d5e"
            SUBNET_1="subnet-c328edef"
            SUBNET_2="subnet-b256e0fa"
            SECURITY_GROUP="sg-0d9f4c4f53e2f614e"
            
            if [ "$DB_HOST" == "platform-staging.ccj8gejueyfv.us-east-1.rds.amazonaws.com" ]; then
                DB_HOST="platform-staging.ccj8gejueyfv.us-east-1.rds.amazonaws.com"
                DB_USER="contently_readonly"
                SECRET_NAME="contently/database/credentials"
                READ_ONLY="true"  # Always read-only for staging
            fi
            echo "Using default staging network and database configuration"
        else
            echo "Using custom network configuration for staging environment"
        fi
        ;;
    "prod")
        # Production environment settings
        if [ "$VPC_ID" == "vpc-27f51d5e" ]; then
            # Only set defaults if user hasn't overridden them
            VPC_ID="vpc-fbd4499e"  # Production VPC
            SUBNET_1="subnet-dc269885"  # Production subnet 1
            SUBNET_2="subnet-80aa33f7"  # Production subnet 2
            SECURITY_GROUP="sg-0a8f7e5c3d2b1f9e0"  # Production security group
            
            if [ "$DB_HOST" == "platform-staging.ccj8gejueyfv.us-east-1.rds.amazonaws.com" ]; then
                DB_HOST="platform-prod.ccj8gejueyfv.us-east-1.rds.amazonaws.com"
                DB_USER="contently_readonly"
                SECRET_NAME="contently/database/credentials-prod"
                READ_ONLY="true"  # Always read-only for production
            fi
            echo "Using default production network and database configuration"
        else
            echo "Using custom network configuration for production environment"
        fi
        ;;
    "poc")
        # POC environment settings
        if [ "$VPC_ID" == "vpc-27f51d5e" ]; then
            # Only set defaults if user hasn't overridden them
            VPC_ID="vpc-fbd4499e"  # Same as production for POC
            SUBNET_1="subnet-dc269885"  # Same as production for POC
            SUBNET_2="subnet-80aa33f7"  # Same as production for POC
            SECURITY_GROUP="sg-0ea4e0cca5911330b"  # POC security group (from the RDS instance)
            
            if [ "$DB_HOST" == "platform-staging.ccj8gejueyfv.us-east-1.rds.amazonaws.com" ]; then
                DB_HOST="copy-platform-prod-studipto.ccj8gejueyfv.us-east-1.rds.amazonaws.com"
                DB_USER="contently_admin"
                SECRET_NAME="contently/database/credentials-poc"
                # Default to read-only for POC, but can be overridden with --read-only flag
                if [ "$READ_ONLY" == "true" ]; then
                    echo "POC database in read-only mode"
                else
                    echo "POC database with write access enabled"
                fi
            fi
            echo "Using default POC network and database configuration"
        else
            echo "Using custom network configuration for POC environment"
        fi
        ;;
    *)
        echo "Unknown environment: $ENVIRONMENT"
        echo "Using default staging configuration"
        ;;
esac

echo "Deploying to environment: $ENVIRONMENT"
echo "Database host: $DB_HOST"
echo "Database name: $DB_NAME"
echo "Database user: $DB_USER"
echo "Secret name: $SECRET_NAME"
echo "Read-only mode: $READ_ONLY"
echo "VPC ID: $VPC_ID"
echo "Subnet 1: $SUBNET_1"
echo "Subnet 2: $SUBNET_2"
echo "Security Group: $SECURITY_GROUP"

echo "Checking VPC endpoints..."

# Check and create Secrets Manager endpoint if needed
SECRETS_ENDPOINT_ID=$(check_vpc_endpoint "secretsmanager")
if [ "$SECRETS_ENDPOINT_ID" = "None" ] || [ -z "$SECRETS_ENDPOINT_ID" ]; then
    SECRETS_ENDPOINT_ID=$(create_vpc_endpoint "secretsmanager")
fi
echo "Using existing Secrets Manager VPC endpoint: $SECRETS_ENDPOINT_ID"

# Check and create Service Discovery endpoint if needed
DISCOVERY_ENDPOINT_ID=$(check_vpc_endpoint "servicediscovery")
if [ "$DISCOVERY_ENDPOINT_ID" = "None" ] || [ -z "$DISCOVERY_ENDPOINT_ID" ]; then
    DISCOVERY_ENDPOINT_ID=$(create_vpc_endpoint "servicediscovery")
fi
echo "Using existing Service Discovery VPC endpoint: $DISCOVERY_ENDPOINT_ID"

# Check and create RDS endpoint if needed
RDS_ENDPOINT_ID=$(check_vpc_endpoint "rds-data")
if [ "$RDS_ENDPOINT_ID" = "None" ] || [ -z "$RDS_ENDPOINT_ID" ]; then
    RDS_ENDPOINT_ID=$(create_vpc_endpoint "rds-data")
fi
echo "Using existing RDS Data VPC endpoint: $RDS_ENDPOINT_ID"

# Check and create RDS API endpoint if needed
RDS_API_ENDPOINT_ID=$(check_vpc_endpoint "rds")
if [ "$RDS_API_ENDPOINT_ID" = "None" ] || [ -z "$RDS_API_ENDPOINT_ID" ]; then
    RDS_API_ENDPOINT_ID=$(create_vpc_endpoint "rds")
fi
echo "Using existing RDS API VPC endpoint: $RDS_API_ENDPOINT_ID"

# Check and create CloudWatch Logs endpoint if needed
LOGS_ENDPOINT_ID=$(check_vpc_endpoint "logs")
if [ "$LOGS_ENDPOINT_ID" = "None" ] || [ -z "$LOGS_ENDPOINT_ID" ]; then
    LOGS_ENDPOINT_ID=$(create_vpc_endpoint "logs")
fi
echo "Using existing CloudWatch Logs VPC endpoint: $LOGS_ENDPOINT_ID"

if [ "$BUILD" = true ]; then
    echo "Building and deploying..."
    if check_for_changes || [ "$FORCE" = true ]; then
        echo "Changes detected in source files or requirements, or force flag set, rebuilding..."
        pip install -r requirements.txt
    else
        echo "No changes detected in source files or requirements, skipping build and deploy..."
        exit 0
    fi
fi

# Build and deploy
sam build \
    --template-file template.yaml \
    --parameter-overrides \
        "VpcId=$VPC_ID" \
        "PrivateSubnet1=$SUBNET_1" \
        "PrivateSubnet2=$SUBNET_2" \
        "SecurityGroup=$SECURITY_GROUP" \
        "DbHost=$DB_HOST" \
        "DbName=$DB_NAME" \
        "DbUser=$DB_USER" \
        "ContentlyUrl=$CONTENTLY_URL" \
        "TpmToolsAccountId=$TPM_TOOLS_ACCOUNT_ID" \
        "Environment=$ENVIRONMENT" \
        "SecretName=$SECRET_NAME" \
        "ReadOnly=$READ_ONLY"

sam deploy \
    --stack-name "tpm-tools-db-proxy-$ENVIRONMENT" \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
        "VpcId=$VPC_ID" \
        "PrivateSubnet1=$SUBNET_1" \
        "PrivateSubnet2=$SUBNET_2" \
        "SecurityGroup=$SECURITY_GROUP" \
        "DbHost=$DB_HOST" \
        "DbName=$DB_NAME" \
        "DbUser=$DB_USER" \
        "ContentlyUrl=$CONTENTLY_URL" \
        "TpmToolsAccountId=$TPM_TOOLS_ACCOUNT_ID" \
        "Environment=$ENVIRONMENT" \
        "SecretName=$SECRET_NAME" \
        "ReadOnly=$READ_ONLY" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" \
    --resolve-s3 \
    --no-fail-on-empty-changeset \
    --no-confirm-changeset

# Get function info from stack outputs
STACK_OUTPUTS=$(aws cloudformation describe-stacks \
    --stack-name "tpm-tools-db-proxy-$ENVIRONMENT" \
    --profile "$AWS_PROFILE" \
    --region "$REGION" \
    --query 'Stacks[0].Outputs' \
    --output json)

FUNCTION_NAME=$(echo "$STACK_OUTPUTS" | jq -r '.[] | select(.OutputKey=="BastionFunctionName") | .OutputValue')
FUNCTION_URL=$(echo "$STACK_OUTPUTS" | jq -r '.[] | select(.OutputKey=="BastionFunctionUrl") | .OutputValue' | sed 's/https:\/\///')

echo ""
echo "Deployment completed successfully!"
echo "Environment: $ENVIRONMENT"
echo "Function Name: $FUNCTION_NAME"
echo "Function URL: https://$FUNCTION_URL"
echo ""
echo "To test the function, use:"
echo "curl -X POST https://$FUNCTION_URL/sql -H 'Content-Type: application/json' -d '{\"sql\":\"SELECT current_database(), current_user, version()\"}'"

echo ""
echo "To view logs, use:"
echo "sam logs -n $FUNCTION_NAME --stack-name tpm-tools-db-proxy-$ENVIRONMENT --profile $AWS_PROFILE --region $REGION"
