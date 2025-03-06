import json
import requests
import os
import re

CONTENTLY_URL = os.environ.get('CONTENTLY_URL', 'https://qa3.contently.xyz')

def add_cors_headers(response, origin):
    print(f"Adding CORS headers for origin: {origin}")
    headers = {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Headers': 'authorization,content-type,cookie,x-csrf-token',
        'Access-Control-Allow-Methods': 'DELETE,GET,OPTIONS,POST',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
        'vary': 'origin'
    }
    print(f"CORS headers being added: {json.dumps(headers, indent=2)}")
    response['headers'] = headers
    return response

def create_response(status_code, body, headers=None):
    response = {
        'statusCode': status_code,
        'body': json.dumps(body) if isinstance(body, (dict, list)) else body,
        'headers': headers or {}
    }
    print(f"Creating response: {json.dumps(response, indent=2)}")
    return response

def handler(event, context):
    print(f"Received event: {json.dumps(event, indent=2)}")
    
    # Get headers safely
    headers = event.get('headers', {}) or {}
    origin = headers.get('origin', '')
    
    # Get request context safely
    request_context = event.get('requestContext', {}).get('http', {})
    method = request_context.get('method', '')
    path = request_context.get('path', '')
    
    print(f"Request details - Origin: {origin}, Method: {method}, Path: {path}")
    
    # Handle missing required fields
    if not method or not path:
        return add_cors_headers(create_response(400, {'error': 'Invalid request'}), origin)
    
    # Handle OPTIONS preflight request
    if method == 'OPTIONS':
        print("Handling OPTIONS request")
        cors_response = create_response(200, '')
        cors_response_with_headers = add_cors_headers(cors_response, origin)
        print(f"Final OPTIONS response: {json.dumps(cors_response_with_headers, indent=2)}")
        return cors_response_with_headers
    
    try:
        if path == '/auth/signin' and method == 'POST':
            print("Processing signin request...")
            # Get the login credentials from the request body
            body = event.get('body', '{}')
            if isinstance(body, str):
                body = json.loads(body)
            
            user = body.get('user', {})
            email = user.get('email')
            password = user.get('password')
            
            if not email or not password:
                return add_cors_headers(
                    create_response(400, {'error': 'Email and password are required'}),
                    origin
                )
            
            # Forward the request to Contently's OAuth endpoint
            contently_url = f"{CONTENTLY_URL}/oauth/token"
            print(f"Making request to Contently: {contently_url}")
            response = requests.post(
                contently_url,
                json={
                    "grant_type": "password",
                    "username": email,
                    "password": password
                },
                headers={"Content-Type": "application/json"}
            )
            
            print(f"Contently response status: {response.status_code}")
            print(f"Contently response headers: {dict(response.headers)}")
            print(f"Contently response body: {response.text}")
            
            if response.status_code >= 400:
                error_message = "Authentication failed"
                try:
                    error_data = response.json()
                    if 'error' in error_data:
                        error_message = error_data['error']
                except:
                    pass
                return add_cors_headers(
                    create_response(response.status_code, {'error': error_message}),
                    origin
                )
            
            # Extract the token from the response
            try:
                token_data = response.json()
                return add_cors_headers(
                    create_response(200, {
                        'access_token': token_data['access_token'],
                        'token_type': token_data['token_type'],
                        'expires_in': token_data['expires_in']
                    }),
                    origin
                )
            except Exception as e:
                print(f"Error parsing token response: {str(e)}")
                return add_cors_headers(
                    create_response(500, {'error': 'Failed to parse authentication response'}),
                    origin
                )
            
    except Exception as e:
        print(f"Error: {str(e)}")
        return add_cors_headers(
            create_response(500, {'error': str(e)}),
            origin
        )
