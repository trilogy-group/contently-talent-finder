import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SeoKeyword } from '../../../types/content-strategy';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const publicationId = event.pathParameters?.publicationId;
    const keywordId = event.pathParameters?.keywordId;
    const method = event.httpMethod;

    if (method === 'GET') {
      // List SEO keywords
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/seo_keywords`,
        {
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch SEO keywords: ${response.statusText}`);
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
      // Create SEO keyword
      const keyword: SeoKeyword = JSON.parse(event.body || '{}');
      
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/seo_keywords`,
        {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ seo_keyword: keyword })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to create SEO keyword: ${response.statusText}`);
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
    } else if (method === 'DELETE' && keywordId) {
      // Delete SEO keyword
      const response = await fetch(
        `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/seo_keywords/${keywordId}`,
        {
          method: 'DELETE',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete SEO keyword: ${response.statusText}`);
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
