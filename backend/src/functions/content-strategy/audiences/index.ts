import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Audience } from '../../../types/content-strategy';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const publicationId = event.pathParameters?.publicationId;
    const audienceId = event.pathParameters?.audienceId;
    const method = event.httpMethod;

    if (method === 'GET' && !audienceId) {
      // List audiences
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/audiences`,
        {
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch audiences: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      };
    } else if (method === 'POST') {
      // Create audience
      const audience: Audience = JSON.parse(event.body || '{}');
      
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/audiences`,
        {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audience })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create audience: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      };
    } else if (method === 'PUT' && audienceId) {
      // Update audience
      const audience: Audience = JSON.parse(event.body || '{}');
      
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/audiences/${audienceId}`,
        {
          method: 'PUT',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audience })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update audience: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(data)
      };
    } else if (method === 'DELETE' && audienceId) {
      // Delete audience
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/audiences/${audienceId}`,
        {
          method: 'DELETE',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete audience: ${response.statusText}`);
      }

      return {
        statusCode: 204,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: ''
      };
    }

    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
}; 