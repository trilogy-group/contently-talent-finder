import json
import os
import re
import psycopg2
import boto3
import requests

def get_db_password():
    session = boto3.session.Session()
    client = session.client('secretsmanager')
    try:
        response = client.get_secret_value(
            SecretId='contently/database/credentials'
        )
        secret = json.loads(response['SecretString'])
        return secret['staging_password']
    except Exception as e:
        print(f"Error getting secret: {str(e)}")
        raise

def is_read_only_query(sql):
    # Convert to lowercase for easier matching
    sql = sql.lower().strip()
    
    # Check if query starts with SELECT
    if not sql.startswith('select'):
        return False
        
    # List of dangerous keywords that might modify data
    dangerous_keywords = [
        'insert',
        'update',
        'delete',
        'drop',
        'alter',
        'create',
        'replace',
        'truncate',
        'exec',
        'execute',
        'merge',
        'upsert',
        'call',
        'grant',
        'revoke'
    ]
    
    # Check if any dangerous keywords appear in the query
    for keyword in dangerous_keywords:
        # Match whole words only
        pattern = r'\b' + keyword + r'\b'
        if re.search(pattern, sql):
            return False
            
    return True

def handle_sql(event):
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        sql = body.get('sql')
        if not sql:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing SQL query'})
            }
            
        # Validate read-only
        if not is_read_only_query(sql):
            return {
                'statusCode': 403,
                'body': json.dumps({'error': 'Only SELECT queries are allowed'})
            }
        
        # Connect to database
        conn = psycopg2.connect(
            host=os.environ['DB_HOST'],
            dbname=os.environ['DB_NAME'],
            user=os.environ['DB_USER'],
            password=get_db_password()
        )
        
        # Execute query
        with conn.cursor() as cur:
            cur.execute(sql)
            columns = [desc[0] for desc in cur.description]
            results = [dict(zip(columns, row)) for row in cur.fetchall()]
            
        conn.close()
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'results': results
            })
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }

def handle_auth(event):
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        code = body.get('code')
        if not code:
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing code parameter'})
            }

        # Forward request to Contently
        contently_url = os.environ['CONTENTLY_URL'].rstrip('/')
        response = requests.post(
            f'{contently_url}/api/v1/oauth/token',
            json={
                'code': code,
                'grant_type': 'authorization_code'
            }
        )
        
        return {
            'statusCode': response.status_code,
            'body': response.text
        }
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }

def lambda_handler(event, context):
    # Get the path from the event
    path = event.get('rawPath', '')
    
    if path == '/sql':
        return handle_sql(event)
    elif path == '/auth':
        return handle_auth(event)
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': f'Path not found: {path}'})
        }
