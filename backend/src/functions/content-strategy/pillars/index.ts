import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Pillar } from '../../../types/content-strategy';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const publicationId = event.pathParameters?.publicationId;
    const pillarId = event.pathParameters?.pillarId;
    const method = event.httpMethod;

    if (method === 'GET' && !pillarId) {
      // List pillars
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/pillars`,
        {
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch pillars: ${response.statusText}`);
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
      // Create pillar
      const pillar: Pillar = JSON.parse(event.body || '{}');
      
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/pillars`,
        {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pillar })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create pillar: ${response.statusText}`);
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
    } else if (method === 'PUT' && pillarId) {
      // Update pillar
      const pillar: Pillar = JSON.parse(event.body || '{}');
      
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/pillars/${pillarId}`,
        {
          method: 'PUT',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ pillar })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update pillar: ${response.statusText}`);
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
    } else if (method === 'DELETE' && pillarId) {
      // Delete pillar
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/pillars/${pillarId}`,
        {
          method: 'DELETE',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete pillar: ${response.statusText}`);
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
