import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { SearchCriteria } from '../../types/talent';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const searchCriteria: SearchCriteria = JSON.parse(event.body || '{}');
    
    // Create talent request
    const searchCriteriaNameDescription = searchCriteria.name ?? `Talent Request from PoC ${Math.random().toString(36).substring(2, 9)}`;
    const createResponse = await fetch(`${process.env.CONTENTLY_API_ENDPOINT}/api/v1/talent_requests`, {
      method: 'POST',
      headers: {
        'X-API-KEY': process.env.CONTENTLY_API_KEY || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        talent_request: {
          brand_profile_id: searchCriteria.brandProfileId ?? 3088,
          name: searchCriteriaNameDescription,
          description: searchCriteriaNameDescription,
          story_format: searchCriteria.storyFormat ?? 'article',
          content_examples: searchCriteria.contentExamples?.length > 0 ? searchCriteria.contentExamples : ["https://www.sciencenews.org/topic/health-medicine", "https://www.thelancet.com/", "https://www.the-scientist.com/tag/healthcare"],
          language_id: searchCriteria.languageId ?? 1,
          pillar_id: searchCriteria.pillarId,
          needed_by: searchCriteria.neededBy ?? (() => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            return date.toISOString().split('T')[0];
          })(),
          on_site: searchCriteria.onSite ?? false,
          location: searchCriteria.location,
          other_info: searchCriteria.otherInfo,
          budget_range_min: searchCriteria.budgetRangeMin ?? 100,
          budget_range_max: searchCriteria.budgetRangeMax ?? 5000,
          topic_ids: searchCriteria.topicIds,
          skill_ids: searchCriteria.skillIds,
        }
      })
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create talent request: ${createResponse.statusText}`);
    }

    const createData = await createResponse.json() as { id: string };
    const talentRequestId = createData.id;

    // Fetch talent request details
    const getResponse = await fetch(
      `${process.env.CONTENTLY_API_ENDPOINT}/api/v1/talent_requests/${talentRequestId}`,
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

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(talentData)
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
