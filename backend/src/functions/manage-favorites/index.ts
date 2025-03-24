import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    rejectUnauthorized: false
  }
});

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { userId, talentId } = JSON.parse(event.body || '{}');
    const method = event.httpMethod;

    if (!userId || !talentId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Missing required parameters' })
      };
    }

    if (method === 'POST') {
      // Add to favorites
      await pool.query(
        'INSERT INTO user_favorites (user_id, talent_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [userId, talentId]
      );
    } else if (method === 'DELETE') {
      // Remove from favorites
      await pool.query(
        'DELETE FROM user_favorites WHERE user_id = $1 AND talent_id = $2',
        [userId, talentId]
      );
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true })
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
