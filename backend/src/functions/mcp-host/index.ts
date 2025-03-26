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

// Helper function to normalize content examples array
function normalizeContentExamples(urls: string[]): string[] {
  // Default examples if no URLs provided
  const defaultExamples = [
    "https://www.sciencenews.org/topic/health-medicine",
    "https://www.thelancet.com/",
    "https://www.the-scientist.com/tag/healthcare"
  ];

  // If no URLs provided, return default examples
  if (urls.length === 0) {
    return defaultExamples;
  }

  // If less than 3 URLs, duplicate existing ones to reach minimum
  let normalizedUrls = [...urls];
  while (normalizedUrls.length < 3) {
    normalizedUrls.push(normalizedUrls[normalizedUrls.length % urls.length]);
  }

  // If more than 10 URLs, keep only first 10
  if (normalizedUrls.length > 10) {
    normalizedUrls = normalizedUrls.slice(0, 10);
  }

  return normalizedUrls;
}

// Helper function to extract search parameters from natural language
async function parseNaturalLanguageQuery(query: string) {
  // Get available options from database for matching
  const [skillsQuery, formatsQuery, topicsQuery] = await Promise.all([
    pool.query('SELECT id, name FROM skills ORDER BY name'),
    pool.query('SELECT description FROM story_formats ORDER BY description'),
    pool.query('SELECT id, name FROM topics WHERE visible = true ORDER BY name')
  ]);

  const skills = skillsQuery.rows;
  const formats = formatsQuery.rows.map(row => ({
    id: row.description.toLowerCase().replace(/\s+/g, '_'),
    name: row.description
  }));
  const topics = topicsQuery.rows;

  const queryLower = query.toLowerCase();
  
  // Extract URLs and normalize them
  const extractedUrls = extractUrls(query);
  const normalizedContentExamples = normalizeContentExamples(extractedUrls);
  
  // Extract parameters by matching against available options
  const extractedParams = {
    skillIds: skills.filter(skill => 
      queryLower.includes(skill.name.toLowerCase())
    ).map(skill => skill.id),
    
    storyFormat: formats.find(format => 
      queryLower.includes(format.name.toLowerCase())
    )?.id || 'article',
    
    topicIds: topics.filter(topic => 
      queryLower.includes(topic.name.toLowerCase())
    ).map(topic => topic.id),
    
    // Use normalized content examples
    contentExamples: normalizedContentExamples,
    brandProfileId: 3088, // Default value
    languageId: 1, // Default value
  };

  return extractedParams;
}

// Helper function to extract URLs from text
function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const mcpRequest: MCPRequest = JSON.parse(event.body || '{}');
    
    const response: MCPResponse = {
      version: '1.0',
      status: 'success',
      data: null,
      error: null
    };

    switch (mcpRequest.action) {
      case 'searchTalent':
        // Parse natural language query
        const searchParams = await parseNaturalLanguageQuery(mcpRequest.params.query);
        
        // Create talent request using Contently API
        const createResponse = await fetch(`${process.env.CONTENTLY_API_ENDPOINT}/api/v1/talent_requests`, {
          method: 'POST',
          headers: {
            'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            talent_request: {
              brand_profile_id: searchParams.brandProfileId,
              name: `Talent Request from MCP ${Date.now()}`,
              description: mcpRequest.params.query,
              story_format: searchParams.storyFormat,
              content_examples: searchParams.contentExamples,
              language_id: searchParams.languageId,
              topic_ids: searchParams.topicIds,
              skill_ids: searchParams.skillIds,
              needed_by: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 1);
                return date.toISOString().split('T')[0];
              })()
            }
          })
        });

        if (!createResponse.ok) {
          throw new Error(`Failed to create talent request: ${createResponse.statusText}`);
        }

        const createData = await createResponse.json() as { id: string };
        
        // Fetch talent request results
        const getResponse = await fetch(
          `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/talent_requests/${createData.id}`,
          {
            headers: {
              'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
            }
          }
        );

        if (!getResponse.ok) {
          throw new Error(`Failed to fetch talent request: ${getResponse.statusText}`);
        }

        const talentData = await getResponse.json();
        response.data = talentData;
        break;

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
