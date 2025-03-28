import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Pillar } from '../../../types/content-strategy';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const publicationId = event.pathParameters?.publicationId;
    const pillarId = event.pathParameters?.pillarId;
    const method = event.httpMethod;

    if (method === 'GET' && !pillarId) {
      // List plans
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/plans`,
        {
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch plans: ${response.statusText}`);
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
    } else if (method === 'GET' && pillarId) {
      // Get single plan
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/plans/${pillarId}`,
        {
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch plan: ${response.statusText}`);
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
    } else if (method === 'PUT' && pillarId) {
      // Update plan
      const pillar: Pillar = JSON.parse(event.body || '{}');
      
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/plans/${pillarId}`,
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
        throw new Error(`Failed to update plan: ${response.statusText}`);
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
