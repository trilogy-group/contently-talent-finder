import os
import json
import boto3
import psycopg2
import traceback

def lambda_handler(event, context):
    try:
        # Get database credentials
        db_host = os.environ.get('DB_HOST')
        db_name = os.environ.get('DB_NAME')
        db_user = os.environ.get('DB_USER')
        secret_name = os.environ.get('SECRET_NAME')
        environment = os.environ.get('ENVIRONMENT', 'staging').lower()
        
        # Determine password key
        if environment == 'poc':
            password_key = 'poc_password'
        elif environment == 'prod':
            password_key = 'prod_password'
        else:
            password_key = 'staging_password'
        
        # Get password from Secrets Manager
        session = boto3.session.Session()
        client = session.client('secretsmanager')
        
        print(f"Retrieving secret from {secret_name} with key {password_key}")
        response = client.get_secret_value(SecretId=secret_name)
        secret = json.loads(response['SecretString'])
        print(f"Secret keys available: {list(secret.keys())}")
        db_password = secret[password_key]
        
        # Try to connect to the database
        print(f"Connecting to database: host={db_host}, dbname={db_name}, user={db_user}")
        conn = psycopg2.connect(
            host=db_host,
            dbname=db_name,
            user=db_user,
            password=db_password,
            connect_timeout=10  # Short timeout for testing
        )
        
        # Test query
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            result = cur.fetchone()
        
        conn.close()
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Successfully connected to database',
                'result': result[0]
            })
        }
    except Exception as e:
        traceback.print_exc()
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e),
                'traceback': traceback.format_exc()
            })
        }
