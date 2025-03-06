import json
import os
import requests
import boto3

def get_hash_secret():
    """Get the hash secret from AWS Secrets Manager."""
    client = boto3.client('secretsmanager')
    try:
        response = client.get_secret_value(SecretId='contently/bastion/credentials')
        secret = json.loads(response['SecretString'])
        return secret['hash_secret']
    except Exception as e:
        print(f"Error getting hash secret: {str(e)}")
        raise

def add_cors_headers(response, origin):
    """Add CORS headers to the response."""
    response['headers'] = {
        'Access-Control-Allow-Origin': origin if origin else '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true'
    }
    return response

def forward_to_bastion(path, body):
    """Forward request to bastion lambda using function URL."""
    bastion_url = os.environ['BASTION_FUNCTION_URL'].rstrip('/')
    
    # Ensure URL has https:// prefix
    if not bastion_url.startswith('https://'):
        bastion_url = f'https://{bastion_url}'
    
    # Get hash secret for authentication
    hash_secret = get_hash_secret()
    
    # Prepare headers with hash secret
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': hash_secret
    }
    
    # Log request details (mask the hash secret)
    url = f"{bastion_url}/{path.lstrip('/')}"
    print(f"Making request to bastion: {url}")
    print(f"Request headers: {{'Content-Type': 'application/json', 'x-api-key': '***'}}")
    print(f"Request body: {json.dumps(body, indent=2)}")
    
    # Make request to bastion function URL
    response = requests.post(
        url,
        headers=headers,
        json=body
    )
    
    # Log response details
    print(f"Bastion response status: {response.status_code}")
    print(f"Bastion response headers: {dict(response.headers)}")
    print(f"Bastion response body: {response.text}")
    
    # Parse response
    try:
        response_body = response.json()
    except:
        response_body = response.text
    
    return {
        'statusCode': response.status_code,
        'body': json.dumps(response_body) if isinstance(response_body, (dict, list)) else response_body
    }

def handler(event, context):
    """Handle incoming requests and forward them to the bastion lambda."""
    print("Received event:", json.dumps(event, indent=2))
    
    # Get request details
    path = event.get('rawPath', '').lstrip('/')  
    origin = event.get('headers', {}).get('origin', '')
    method = event.get('requestContext', {}).get('http', {}).get('method', '')
    
    print(f"Request details - Origin: {origin}, Method: {method}, Path: {path}")
    
    # Handle OPTIONS request for CORS
    if method == 'OPTIONS':
        return add_cors_headers({
            'statusCode': 200,
            'body': ''
        }, origin)
    
    # Get request body
    body = json.loads(event.get('body', '{}')) if event.get('body') else {}
    print(f"Request body: {json.dumps(body, indent=2)}")
    
    # Forward request to bastion
    try:
        response = forward_to_bastion(path, body)
        print(f"Bastion response: {response.get('statusCode', 500)} - {response.get('body', '')}")
        return add_cors_headers(response, origin)
    except Exception as e:
        print(f"Error: {str(e)}")
        error_response = {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
        return add_cors_headers(error_response, origin)
