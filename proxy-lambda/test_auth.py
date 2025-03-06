#!/usr/bin/env python3
print("=====================================")
print("STARTING AUTH TEST")
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

url = 'https://6urycyn3yfnkb5nxgr2vnkt3xu0cufot.lambda-url.us-east-1.on.aws/auth'
headers = {
    'Content-Type': 'application/json',
}
body = {
    'username': 'jmercedes@contently.com',
    'password': 'password'
}

print("\nCreating signed request...")
request = AWSRequest(
    method='POST',
    url=url,
    data=json.dumps(body).encode('utf-8'),
    headers=headers
)

SigV4Auth(credentials, 'lambda', 'us-east-1').add_auth(request)
final_headers = dict(request.headers)
print(f"Final headers: {json.dumps(final_headers, indent=2)}")

print("\nMaking request to Lambda function...")
response = requests.post(
    url,
    headers=final_headers,
    json=body
)

print(f"\nLambda response status: {response.status_code}")
print("Lambda response headers:", json.dumps(dict(response.headers), indent=2))
print("Lambda response body:", response.text)

if response.text:
    try:
        print("\nResponse JSON:", json.dumps(response.json(), indent=2))
    except json.JSONDecodeError:
        print("Response is not JSON")
