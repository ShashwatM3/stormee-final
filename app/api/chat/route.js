export async function POST(req) {
  try {
    const { messages } = await req.json();
    // console.log('Received messages:', messages);

    if (!process.env.PERPLEXITY_API_KEY) {
      // console.error('Perplexity API key is missing');
      return Response.json(
        { error: 'Perplexity API key is not configured' },
        { status: 500 }
      );
    }

    // console.log('Making request to Perplexity API...');
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar-pro',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.5,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      // console.error('Perplexity API error:', error);
      return Response.json(
        { error: error.message || 'Failed to fetch from Perplexity' },
        { status: response.status }
      );
    }

    const data = await response.json();
    // console.log('Perplexity API response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      // console.error('Unexpected response format:', data);
      return Response.json(
        { error: 'Unexpected response format from Perplexity' },
        { status: 500 }
      );
    }

    // Maintain the same response format as before
    return Response.json({
      choices: [{
        message: {
          role: 'assistant',
          content: data.choices[0].message.content
        }
      }]
    });
  } catch (error) {
    // console.error('Chat API error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}