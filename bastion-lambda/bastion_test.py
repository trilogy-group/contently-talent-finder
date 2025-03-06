#!/usr/bin/env python3
print("=====================================")
print("STARTING BASTION TEST")
print("=====================================")

import boto3
import requests
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
import json
import sys
import os

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

print("\nSetting up AWS credentials...")
session = boto3.Session(profile_name='contently-prod')
credentials = session.get_credentials()

# Base URL for the bastion lambda
bastion_url = os.environ.get('BASTION_URL', '').rstrip('/')
if not bastion_url:
    print("Error: BASTION_URL environment variable not set")
    sys.exit(1)

def make_signed_request(path, body):
    """Make a signed request to the bastion lambda."""
    url = f"{bastion_url}{path}"
    print(f"\nMaking request to {url}")
    print(f"Request body: {json.dumps(body, indent=2)}")
    
    # Create and sign request
    request = AWSRequest(
        method='POST',
        url=url,
        data=json.dumps(body).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    SigV4Auth(credentials, 'lambda', 'us-east-1').add_auth(request)
    
    # Make the request
    response = requests.post(
        url,
        headers=dict(request.headers),
        json=body
    )
    
    print(f"\nResponse status: {response.status_code}")
    print(f"Response headers: {json.dumps(dict(response.headers), indent=2)}")
    print(f"Response body: {response.text}")
    return response

# Test /auth endpoint
print("\n=== Testing /auth endpoint ===")
auth_response = make_signed_request('/auth', {
    'username': 'jmercedes@contently.com',
    'password': 'password'
})

# Test /sql endpoint
print("\n=== Testing /sql endpoint ===")
sql_response = make_signed_request('/sql', {
    'sql': """
    SELECT 
        table_schema,
        table_name,
        table_type
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY table_schema, table_name
    LIMIT 5;
    """
})
