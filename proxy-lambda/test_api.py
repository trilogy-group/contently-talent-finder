#!/usr/bin/env python3
print("=====================================")
print("STARTING API TEST")
print("=====================================")

import boto3
import requests
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
import json
import sys

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

print("\nSetting up AWS credentials...")
session = boto3.Session(profile_name='contently-prod')
credentials = session.get_credentials()

# First authenticate
auth_url = 'https://6urycyn3yfnkb5nxgr2vnkt3xu0cufot.lambda-url.us-east-1.on.aws/auth'
headers = {
    'Content-Type': 'application/json',
}
auth_body = {
    'username': 'jmercedes@contently.com',
    'password': 'password'
}

print("\nCreating signed auth request...")
auth_request = AWSRequest(
    method='POST',
    url=auth_url,
    data=json.dumps(auth_body).encode('utf-8'),
    headers=headers
)

SigV4Auth(credentials, 'lambda', 'us-east-1').add_auth(auth_request)
final_auth_headers = dict(auth_request.headers)

print("\nMaking auth request to Lambda function...")
auth_response = requests.post(
    auth_url,
    headers=final_auth_headers,
    json=auth_body
)

print(f"\nAuth response status: {auth_response.status_code}")
print("Auth response headers:", json.dumps(dict(auth_response.headers), indent=2))
print("Auth response body:", auth_response.text)

if auth_response.status_code != 200:
    print("Authentication failed!")
    sys.exit(1)

# Get token from auth response
auth_data = auth_response.json()
token = auth_data.get('token')
if not token:
    print("No token in auth response!")
    sys.exit(1)

# Now make the SQL query with the token
query_url = 'https://6urycyn3yfnkb5nxgr2vnkt3xu0cufot.lambda-url.us-east-1.on.aws/sql'
query_body = {
    'sql': """
    SELECT 
        table_schema,
        table_name,
        table_type
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY table_schema, table_name;
    """
}

print("\nCreating signed SQL query request...")
query_request = AWSRequest(
    method='POST',
    url=query_url,
    data=json.dumps(query_body).encode('utf-8'),
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}'
    }
)

SigV4Auth(credentials, 'lambda', 'us-east-1').add_auth(query_request)
final_query_headers = dict(query_request.headers)

print("\nMaking SQL query request to Lambda function...")
print(f"URL: {query_url}")
print(f"Headers: {json.dumps(final_query_headers, indent=2)}")
print(f"Body: {json.dumps(query_body, indent=2)}")

query_response = requests.post(
    query_url,
    headers=final_query_headers,
    json=query_body
)

print(f"\nSQL query response status: {query_response.status_code}")
print("SQL query response headers:", json.dumps(dict(query_response.headers), indent=2))
print("SQL query response body:", query_response.text)

if query_response.text:
    try:
        print("\nResponse JSON:", json.dumps(query_response.json(), indent=2))
    except json.JSONDecodeError:
        print("Response is not JSON")
