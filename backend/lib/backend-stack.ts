import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Add VPC lookup
    const vpc = ec2.Vpc.fromLookup(this, 'ExistingVPC', {
      isDefault: false, // Set to true if using default VPC
      vpcId: process.env.VPC_ID || 'vpc-27f51d5e', // Make sure to set this environment variable
    });

    // Create role for Lambda functions to access RDS
    const lambdaRole = new iam.Role(this, 'TalentServiceRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaVPCAccessExecutionRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Lambda functions
    const searchTalentFunction = new nodejs.NodejsFunction(this, 'SearchTalentFunction', {
      entry: 'src/functions/search-talent/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        DB_HOST: process.env.DB_HOST || '',
        DB_NAME: process.env.DB_NAME || '',
        DB_USER: process.env.DB_USER || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    const manageFavoritesFunction = new nodejs.NodejsFunction(this, 'ManageFavoritesFunction', {
      entry: 'src/functions/manage-favorites/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        DB_HOST: process.env.DB_HOST || '',
        DB_NAME: process.env.DB_NAME || '',
        DB_USER: process.env.DB_USER || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    const mcpHostFunction = new nodejs.NodejsFunction(this, 'McpHostFunction', {
      entry: 'src/functions/mcp-host/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        DB_HOST: process.env.DB_HOST || '',
        DB_NAME: process.env.DB_NAME || '',
        DB_USER: process.env.DB_USER || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Add the new Lambda function for dropdown options
    const dropdownOptionsFunction = new nodejs.NodejsFunction(this, 'DropdownOptionsFunction', {
      entry: 'src/functions/get-dropdown-options/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        DB_HOST: process.env.DB_HOST || '',
        DB_NAME: process.env.DB_NAME || '',
        DB_USER: process.env.DB_USER || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // API Gateway
    const api = new apigateway.RestApi(this, 'TalentApi', {
      restApiName: 'Talent Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // API routes
    const talentResource = api.root.addResource('talent');
    const searchResource = talentResource.addResource('search');
    const favoritesResource = talentResource.addResource('favorites');
    const mcpResource = api.root.addResource('mcp');

    // Search endpoint
    searchResource.addMethod('POST', new apigateway.LambdaIntegration(searchTalentFunction));

    // Favorites endpoints
    favoritesResource.addMethod('POST', new apigateway.LambdaIntegration(manageFavoritesFunction)); // Add to favorites
    favoritesResource.addMethod('DELETE', new apigateway.LambdaIntegration(manageFavoritesFunction)); // Remove from favorites

    // MCP endpoint
    mcpResource.addMethod('POST', new apigateway.LambdaIntegration(mcpHostFunction));

    // Add new endpoint for dropdown options
    const optionsResource = api.root.addResource('options');
    optionsResource.addMethod('GET', new apigateway.LambdaIntegration(dropdownOptionsFunction));
  }
}
