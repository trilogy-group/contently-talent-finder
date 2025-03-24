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

interface DropdownOption {
  value: string | number;
  label: string;
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Query skills
    const skillsQuery = await pool.query(
      'SELECT id, name FROM skills ORDER BY name'
    );
    const skills: DropdownOption[] = skillsQuery.rows.map(row => ({
      value: row.id,
      label: row.name
    }));

    // Query story formats
    const formatsQuery = await pool.query(
      'SELECT description FROM story_formats ORDER BY description'
    );
    const storyFormats: DropdownOption[] = formatsQuery.rows.map(row => {
      let value: string;
      if (row.description.includes('\\') || row.description.includes('/')) {
        value = row.description.split(/[\\\/]/)[0].trim().toLowerCase();
      } else if (row.description.includes(' ')) {
        value = row.description.toLowerCase().replace(/\s+/g, '_');
      } else {
        value = row.description.toLowerCase();
      }
      return {
        value,
        label: row.description
      };
    });

    // Query visible topics
    const topicsQuery = await pool.query(
      'SELECT id, name FROM topics WHERE visible = true ORDER BY name'
    );
    const topics: DropdownOption[] = topicsQuery.rows.map(row => ({
      value: row.id,
      label: row.name
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        skills,
        storyFormats,
        topics
      })
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
