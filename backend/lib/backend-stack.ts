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
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM',
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

    // Content Strategy API
    const getContentStrategyOverview = new nodejs.NodejsFunction(this, 'GetContentStrategyOverviewFunction', {
      entry: 'src/functions/content-strategy/get-overview/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    const getContentStrategyReport = new nodejs.NodejsFunction(this, 'GetContentStrategyReportFunction', {
      entry: 'src/functions/content-strategy/get-report/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // API Gateway
    const contentStrategyApi = new apigateway.RestApi(this, 'ContentStrategyApi', {
      restApiName: 'Content Strategy Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS
      }
    });

    const contentStrategy = contentStrategyApi.root.addResource('content-strategy');
    const publication = contentStrategy.addResource('{publicationId}');
    
    // Overview endpoint
    publication.addMethod('GET', new apigateway.LambdaIntegration(getContentStrategyOverview));
    
    // Report endpoint
    const report = publication.addResource('report');
    report.addMethod('GET', new apigateway.LambdaIntegration(getContentStrategyReport));

    // Mission and Goals Lambda
    const missionAndGoalsFunction = new nodejs.NodejsFunction(this, 'MissionAndGoalsFunction', {
      entry: 'src/functions/content-strategy/mission-and-goals/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Voice and Styles Lambda
    const voiceAndStylesFunction = new nodejs.NodejsFunction(this, 'VoiceAndStylesFunction', {
      entry: 'src/functions/content-strategy/voice-and-styles/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Add routes to API Gateway
    const missionAndGoals = publication.addResource('mission-and-goals');
    missionAndGoals.addMethod('GET', new apigateway.LambdaIntegration(missionAndGoalsFunction));
    missionAndGoals.addMethod('PUT', new apigateway.LambdaIntegration(missionAndGoalsFunction));

    const voiceAndStyles = publication.addResource('voice-and-styles');
    voiceAndStyles.addMethod('GET', new apigateway.LambdaIntegration(voiceAndStylesFunction));
    voiceAndStyles.addMethod('PUT', new apigateway.LambdaIntegration(voiceAndStylesFunction));

    // Distribution Lambda
    const distributionFunction = new nodejs.NodejsFunction(this, 'DistributionFunction', {
      entry: 'src/functions/content-strategy/distribution/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Audiences Lambda
    const audiencesFunction = new nodejs.NodejsFunction(this, 'AudiencesFunction', {
      entry: 'src/functions/content-strategy/audiences/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Add routes to API Gateway
    const distribution = publication.addResource('distribution');
    distribution.addMethod('GET', new apigateway.LambdaIntegration(distributionFunction));
    distribution.addMethod('PUT', new apigateway.LambdaIntegration(distributionFunction));

    const audiences = publication.addResource('audiences');
    audiences.addMethod('GET', new apigateway.LambdaIntegration(audiencesFunction));
    audiences.addMethod('POST', new apigateway.LambdaIntegration(audiencesFunction));
    
    const audience = audiences.addResource('{audienceId}');
    audience.addMethod('PUT', new apigateway.LambdaIntegration(audiencesFunction));
    audience.addMethod('DELETE', new apigateway.LambdaIntegration(audiencesFunction));

    // Pillars Lambda
    const pillarsFunction = new nodejs.NodejsFunction(this, 'PillarsFunction', {
      entry: 'src/functions/content-strategy/pillars/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // SEO Keywords Lambda
    const seoKeywordsFunction = new nodejs.NodejsFunction(this, 'SeoKeywordsFunction', {
      entry: 'src/functions/content-strategy/seo-keywords/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Add routes to API Gateway
    const pillars = publication.addResource('pillars');
    pillars.addMethod('GET', new apigateway.LambdaIntegration(pillarsFunction));
    pillars.addMethod('POST', new apigateway.LambdaIntegration(pillarsFunction));
    
    const pillar = pillars.addResource('{pillarId}');
    pillar.addMethod('PUT', new apigateway.LambdaIntegration(pillarsFunction));
    pillar.addMethod('DELETE', new apigateway.LambdaIntegration(pillarsFunction));

    const seoKeywords = publication.addResource('seo-keywords');
    seoKeywords.addMethod('GET', new apigateway.LambdaIntegration(seoKeywordsFunction));
    seoKeywords.addMethod('POST', new apigateway.LambdaIntegration(seoKeywordsFunction));
    
    const seoKeyword = seoKeywords.addResource('{keywordId}');
    seoKeyword.addMethod('DELETE', new apigateway.LambdaIntegration(seoKeywordsFunction));

    // Plans Lambda
    const plansFunction = new nodejs.NodejsFunction(this, 'PlansFunction', {
      entry: 'src/functions/content-strategy/plans/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
      role: lambdaRole,
      memorySize: 2048,
      timeout: cdk.Duration.minutes(3),
      vpc,
      environment: {
        CONTENTLY_API_ENDPOINT: process.env.CONTENTLY_API_ENDPOINT || 'https://snuffl.in',
        CONTENTLY_API_KEY: process.env.CONTENTLY_API_KEY || 'vrmVRqar57W4rkKSZvgDKjazmBLEBUcM'
      },
      bundling: {
        minify: true,
        sourceMap: true,
      },
    });

    // Add routes to API Gateway
    const plans = publication.addResource('plans');
    plans.addMethod('GET', new apigateway.LambdaIntegration(plansFunction));
    
    const plan = plans.addResource('{pillarId}');
    plan.addMethod('GET', new apigateway.LambdaIntegration(plansFunction));
    plan.addMethod('PUT', new apigateway.LambdaIntegration(plansFunction));
  }
}
