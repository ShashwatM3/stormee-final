// app/api/generate-report/route.ts

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const sonarPrompt = `
${prompt}

Generate a Market Analysis Report for the given company in the following structure:
Industry Overview (Market Size, Industry Trends, Key Drivers), 
Target Market Segmentation (Demographics and Psychographics i.e. interests, values, behaviors), 
Market Opportunity (TAM, SAM, SOM)

Give the output in Markdown format and provide sources at the end.
`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro-chat',
      messages: [
        {
          role: 'user',
          content: sonarPrompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to fetch data from Perplexity' }, { status: 500 });
  }

  const data = await response.json();
  const markdownResponse = data.choices?.[0]?.message?.content ?? '';
  const sources = data.choices?.[0]?.sources ?? [];

  return NextResponse.json({ markdown: markdownResponse, sources });
}
