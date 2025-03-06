import json
import os
import re
import psycopg2
import boto3
import requests
import socket
import logging
import sys

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

# Add a handler that prints to stdout for debugging
handler = logging.StreamHandler(sys.stdout)
handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)

def get_db_password():
    logger.debug("Starting get_db_password function")
    session = boto3.session.Session()
    client = session.client('secretsmanager')
    
    # Get the secret name from environment variable
    secret_id = os.environ.get('SECRET_NAME', 'contently/database/credentials')
    logger.debug(f"Using secret ID: {secret_id}")
    
    # Determine which password key to use based on environment
    environment = os.environ.get('ENVIRONMENT', 'staging').lower()
    logger.debug(f"Environment: {environment}")
    
    # Map environment to password key in the secret
    if environment == 'poc':
        password_key = 'poc_password'
    elif environment == 'prod':
        password_key = 'prod_password'
    else:
        # Default to staging
        password_key = 'staging_password'
    
    logger.debug(f"Using password key: {password_key}")
    
    try:
        logger.debug(f"Retrieving secret from {secret_id} with key {password_key}")
        response = client.get_secret_value(
            SecretId=secret_id
        )
        secret = json.loads(response['SecretString'])
        logger.debug(f"Secret keys available: {list(secret.keys())}")
        
        # Try to get the environment-specific password first
        if password_key in secret:
            logger.debug(f"Found {password_key} in secret")
            return secret[password_key]
        # Fall back to staging_password if the environment-specific key is not found
        elif 'staging_password' in secret:
            logger.debug(f"Environment-specific key {password_key} not found, using staging_password")
            return secret['staging_password']
        # If all else fails, use the first key in the secret
        else:
            first_key = list(secret.keys())[0]
            logger.debug(f"No matching password key found, using first key: {first_key}")
            return secret[first_key]
    except Exception as e:
        logger.error(f"Error getting secret: {str(e)}")
        # Try to get the secret from the default location if the environment-specific one fails
        if secret_id != 'contently/database/credentials':
            logger.debug(f"Trying fallback secret: contently/database/credentials")
            try:
                response = client.get_secret_value(
                    SecretId='contently/database/credentials'
                )
                secret = json.loads(response['SecretString'])
                logger.debug(f"Fallback secret keys available: {list(secret.keys())}")
                
                if 'staging_password' in secret:
                    return secret['staging_password']
                else:
                    first_key = list(secret.keys())[0]
                    return secret[first_key]
            except Exception as fallback_error:
                logger.error(f"Error getting fallback secret: {str(fallback_error)}")
        raise

def is_read_only_query(sql):
    logger.debug(f"Checking if query is read-only: {sql}")
    # Convert to lowercase for easier matching
    sql = sql.lower().strip()
    
    # Check if query starts with SELECT
    if not sql.startswith('select'):
        logger.debug("Query is not read-only")
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
            logger.debug(f"Query contains keyword {keyword}, not read-only")
            return False
            
    logger.debug("Query is read-only")
    return True

def handle_sql(event):
    logger.debug("Starting handle_sql function")
    try:
        # Get request body
        if 'body' not in event:
            logger.error("No body in request")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No body in request'})
            }
        
        # Parse request body
        try:
            body = json.loads(event['body'])
        except json.JSONDecodeError:
            logger.error("Invalid JSON in request body")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Invalid JSON in request body'})
            }
        
        # Get SQL query
        if 'sql' not in body:
            logger.error("No SQL query in request body")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'No SQL query in request body'})
            }
        
        sql = body['sql']
        logger.debug(f"SQL query: {sql}")
        
        # Check if read-only mode is enabled
        read_only = os.environ.get('READ_ONLY', 'true').lower() == 'true'
        logger.debug(f"Read-only mode: {read_only}")
        
        # If read-only mode is enabled, check if the query is read-only
        if read_only and not is_read_only_query(sql):
            logger.error("Write operation not allowed in read-only mode")
            return {
                'statusCode': 403,
                'body': json.dumps({'error': 'Write operation not allowed in read-only mode'})
            }
        
        # Connect to database
        db_host = os.environ.get('DB_HOST')
        db_name = os.environ.get('DB_NAME')
        db_user = os.environ.get('DB_USER')
        db_password = get_db_password()
        
        logger.debug(f"Connecting to database: host={db_host}, dbname={db_name}, user={db_user}")
        
        try:
            conn = psycopg2.connect(
                host=db_host,
                dbname=db_name,
                user=db_user,
                password=db_password,
                connect_timeout=10
            )
            logger.debug("Database connection established")
        except Exception as e:
            logger.error(f"Error connecting to database: {str(e)}")
            # Try to get more information about the connection error
            try:
                logger.debug(f"Attempting to resolve hostname: {db_host}")
                ip_address = socket.gethostbyname(db_host)
                logger.debug(f"Hostname resolved to IP: {ip_address}")
                
                logger.debug(f"Attempting to connect to port 5432 on {ip_address}")
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.settimeout(5)
                result = s.connect_ex((ip_address, 5432))
                if result == 0:
                    logger.debug("Port 5432 is open")
                else:
                    logger.debug(f"Port 5432 is closed, error code: {result}")
                s.close()
            except Exception as socket_error:
                logger.error(f"Error during socket test: {str(socket_error)}")
                
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f'Error connecting to database: {str(e)}'})
            }
        
        # Execute query
        try:
            logger.debug("Executing query")
            cursor = conn.cursor()
            cursor.execute(sql)
            
            # Get column names
            column_names = [desc[0] for desc in cursor.description] if cursor.description else []
            logger.debug(f"Column names: {column_names}")
            
            # Get results
            results = cursor.fetchall()
            logger.debug(f"Query returned {len(results)} rows")
            
            # Commit if not read-only
            if not is_read_only_query(sql):
                logger.debug("Committing transaction")
                conn.commit()
            
            # Close cursor and connection
            cursor.close()
            conn.close()
            logger.debug("Database connection closed")
            
            # Format results
            formatted_results = []
            for row in results:
                formatted_row = {}
                for i, column_name in enumerate(column_names):
                    formatted_row[column_name] = row[i]
                formatted_results.append(formatted_row)
            
            return {
                'statusCode': 200,
                'body': json.dumps({'results': formatted_results})
            }
        except Exception as e:
            logger.error(f"Error executing query: {str(e)}")
            # Rollback if not read-only
            if not is_read_only_query(sql):
                logger.debug("Rolling back transaction")
                conn.rollback()
            
            # Close connection
            conn.close()
            logger.debug("Database connection closed")
            
            return {
                'statusCode': 500,
                'body': json.dumps({'error': f'Error executing query: {str(e)}'})
            }
    except Exception as e:
        logger.error(f"Unexpected error in handle_sql: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Unexpected error: {str(e)}'})
        }

def handle_auth(event):
    logger.debug("Starting handle_auth function")
    try:
        # Parse request body
        body = json.loads(event.get('body', '{}'))
        username = body.get('username')
        password = body.get('password')
        
        if not username or not password:
            logger.error("Missing username or password")
            return {
                'statusCode': 400,
                'body': json.dumps({'error': 'Missing username or password'})
            }
        
        # Make request to Contently auth endpoint
        auth_url = f"{os.environ['CONTENTLY_URL']}/oauth/token"
        response = requests.post(auth_url, json={
            'grant_type': 'password',
            'username': username,
            'password': password
        })
        
        if response.status_code == 200:
            logger.debug("Auth request successful")
            return {
                'statusCode': 200,
                'body': response.text
            }
        else:
            logger.error(f"Auth request failed with status code {response.status_code}")
            return {
                'statusCode': response.status_code,
                'body': response.text
            }
            
    except Exception as e:
        logger.error(f"Error in handle_auth: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }

def lambda_handler(event, context):
    # BREATHING TEST - FIRST LINE OF EXECUTION
    print("BREATHING TEST: Lambda function started")
    logger.debug("BREATHING TEST DEBUG: Lambda function started")
    
    # Log the event structure
    print(f"Event structure: {json.dumps(event)}")
    logger.debug(f"Event structure: {json.dumps(event)}")
    
    path = event.get('rawPath', '') or f"/{event.get('path', '').lstrip('/')}"
    print(f"Path: {path}")
    logger.debug(f"Path: {path}")
    
    if path == '/auth':
        return handle_auth(event)
    elif path == '/sql':
        return handle_sql(event)
    else:
        return {
            'statusCode': 404,
            'body': json.dumps({'error': 'Not found'})
        }
