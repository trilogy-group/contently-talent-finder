import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const publicationId = event.pathParameters?.publicationId;
    
    const response = await fetch(
      `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/publications/${publicationId}/content_strategy/show`,
      {
        headers: {
          'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch content strategy: ${response.statusText}`);
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