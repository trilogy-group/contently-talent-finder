
// Define types for our function
interface GenerateGuidelinesRequest {
  contentType: string;
  category: string;
  mode: "history" | "market";
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function generateGuidelines({ contentType, category, mode }: GenerateGuidelinesRequest) {
  const systemPrompt = mode === "history"
    ? "You are an AI trained on historical brand voice data. Generate guidelines based on successful past examples."
    : "You are an AI trained on current market trends. Generate guidelines based on effective market practices.";

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user', 
            content: `Generate 3-5 ${category} guidelines for ${contentType} content. Each guideline should be clear and actionable.` 
          }
        ],
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate suggestions');
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.replace(/^[0-9-.\s]*/, '').trim());

  } catch (error) {
    console.error('Error generating guidelines:', error);
    throw error;
  }
}
