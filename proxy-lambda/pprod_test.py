#!/usr/bin/env python3
print("=====================================")
print("STARTING PPROD TEST")
print("=====================================")

import requests
import json
import sys

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

# Base URL for the pprod API Gateway
api_url = 'https://rz3w6hbcy6.execute-api.us-east-1.amazonaws.com'

def make_request(path, body):
    """Make a request to the pprod API."""
    url = f"{api_url}{path}"
    print(f"\nMaking request to {url}")
    print(f"Request body: {json.dumps(body, indent=2)}")
    
    # Make the request
    response = requests.post(
        url,
        headers={'Content-Type': 'application/json'},
        json=body
    )
    
    print(f"\nResponse status: {response.status_code}")
    print(f"Response headers: {json.dumps(dict(response.headers), indent=2)}")
    print(f"Response body: {response.text}")
    return response

# Test /auth endpoint
print("\n=== Testing /auth endpoint ===")
auth_response = make_request('/auth', {
    'username': 'jmercedes@contently.com',
    'password': 'password'
})

# Test /sql endpoint
print("\n=== Testing /sql endpoint ===")
sql_response = make_request('/sql', {
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
