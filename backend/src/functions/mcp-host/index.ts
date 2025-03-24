import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Pool } from 'pg';
import { MCPRequest, MCPResponse } from '../../types/mcp';

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
    const mcpRequest: MCPRequest = JSON.parse(event.body || '{}');
    
    // Handle MCP protocol requests
    const response: MCPResponse = {
      version: '1.0',
      status: 'success',
      data: null,
      error: null
    };

    switch (mcpRequest.action) {
      case 'getTalent':
        const result = await pool.query(
          'SELECT * FROM talents WHERE id = $1',
          [mcpRequest.params.talentId]
        );
        response.data = result.rows[0];
        break;

      case 'listTalents':
        const talents = await pool.query(
          'SELECT * FROM talents LIMIT $1 OFFSET $2',
          [mcpRequest.params.limit || 10, mcpRequest.params.offset || 0]
        );
        response.data = talents.rows;
        break;

      default:
        response.status = 'error';
        response.error = 'Unsupported action';
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        version: '1.0',
        status: 'error',
        data: null,
        error: 'Internal server error'
      })
    };
  }
};
