import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { ContentStrategy } from '../../../types/content-strategy';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const publicationId = event.pathParameters?.publicationId;
    const method = event.httpMethod;

    if (method === 'GET') {
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/voice_and_styles`,
        {
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch voice and styles: ${response.statusText}`);
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
    } else if (method === 'PUT') {
      const contentStrategy: Partial<ContentStrategy> = JSON.parse(event.body || '{}');
      
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/voice_and_styles`,
        {
          method: 'PUT',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content_strategy: {
              voice_description: contentStrategy.voice_description,
              allows_first_person: contentStrategy.allows_first_person,
              additional_materials: contentStrategy.additional_materials,
              notes: contentStrategy.notes,
              blacklist: contentStrategy.blacklist,
              tone: contentStrategy.tone
            }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update voice and styles: ${response.statusText}`);
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
