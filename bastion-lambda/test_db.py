#!/usr/bin/env python3
print("=====================================")
print("STARTING DB TEST")
print("=====================================")

import requests
import json
import sys

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)

base_url = 'https://ha6ncnltth357z2bdc4evszypy0mgpfm.lambda-url.us-east-1.on.aws'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'e5ae3fd485f39d16d45829568de7bd1d8aee06b55e6d87b858c3adf5a17401fb'
}

# Test /sql endpoint
print("\n=== Testing /sql endpoint ===\n")
sql_body = {
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
}

print(f"Making request to {base_url}/sql")
print("Request body:", json.dumps(sql_body, indent=2))

response = requests.post(f"{base_url}/sql", headers=headers, json=sql_body)

print(f"\nResponse status: {response.status_code}")
print("Response headers:", json.dumps(dict(response.headers), indent=2))
print("Response body:", response.text)

# Test /auth endpoint
print("\n=== Testing /auth endpoint ===\n")
auth_body = {
    'username': 'jmercedes@contently.com',
    'password': 'password'
}

print(f"Making request to {base_url}/auth")
print("Request body:", json.dumps(auth_body, indent=2))

response = requests.post(f"{base_url}/auth", headers=headers, json=auth_body)

print(f"\nResponse status: {response.status_code}")
print("Response headers:", json.dumps(dict(response.headers), indent=2))
print("Response body:", response.text)
