# Database Proxy Lambda Function

This Lambda function provides a secure way to execute SQL queries against the Contently database from external applications.

## Deployment Process

### 1. Set up Secrets

Before deploying the Lambda function, you need to set up the database credentials in AWS Secrets Manager. Use the `manage-secrets.sh` script to create or update the secrets:

```bash
# For POC environment
./manage-secrets.sh --environment poc --secret-name contently/database/credentials-poc --password TS5ZeVDXKcriCQ7

# For staging environment
./manage-secrets.sh --environment staging --secret-name contently/database/credentials --password your_staging_password

# For production environment
./manage-secrets.sh --environment prod --secret-name contently/database/credentials-prod --password your_prod_password
```

### 2. Deploy the Lambda Function

After setting up the secrets, deploy the Lambda function using the `deploy.sh` script:

```bash
# For POC environment
./deploy.sh --environment poc

# For staging environment
./deploy.sh --environment staging

# For production environment
./deploy.sh --environment prod
```

### 3. Test the Lambda Function

After deployment, you can test the Lambda function using the provided URL:

```bash
curl -X POST https://your-function-url/sql -H "Content-Type: application/json" -d '{"sql":"SELECT current_database(), current_user, version()"}'
```

## Viewing Logs

To view the Lambda function logs, use the following command:

```bash
sam logs -n FunctionName --stack-name tpm-tools-db-proxy-environment --profile contently-prod --region us-east-1
```

Replace `FunctionName` with the actual function name and `environment` with the deployment environment (poc, staging, or prod).

## Architecture

The Lambda function is deployed in a VPC with the following components:

- VPC Endpoints for AWS services (Secrets Manager, CloudWatch Logs, etc.)
- IAM Role with permissions to access Secrets Manager
- Security Group for database access

The function retrieves the database password from AWS Secrets Manager and uses it to connect to the database.

## Security Considerations

- The Lambda function is deployed in a VPC to isolate it from the public internet
- Database credentials are stored in AWS Secrets Manager
- The function can be configured to run in read-only mode to prevent data modification
- Access to the function URL can be restricted using IAM policies or API Gateway authorizers
