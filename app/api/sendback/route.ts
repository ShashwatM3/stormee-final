// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     // Parse the request body
//     let requestBody: { prompt: any; };
//     try {
//       requestBody = await request.json();
//     } catch (error) {
//       return NextResponse.json(
//         { error: 'Invalid JSON in request body' },
//         { status: 400 }
//       );
//     }

//     const { prompt } = requestBody;

//     if (!prompt) {
//       return NextResponse.json(
//         { error: 'Prompt is required' },
//         { status: 400 }
//       );
//     }

//     // Check for API key
//     const apiKey = process.env.OPENROUTER_API_KEY;
//     if (!apiKey) {
//       return NextResponse.json(
//         { error: 'OpenRouter API key is not configured' },
//         { status: 500 }
//       );
//     }

//     // Make request to OpenRouter
//     let response;
//     try {
//       response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${apiKey}`,
//           'Content-Type': 'application/json',
//           'HTTP-Referer': 'https://stormee.ai',
//           'X-Title': 'Stormee AI'
//         },
//         body: JSON.stringify({
//           model: 'deepseek/deepseek-chat-v3-0324:free',
//           messages: [
//             { role: "system", content: "You are a helpful assistant." },
//             { role: "user", content: prompt },
//           ],
//           stream: false,
//           temperature: 0.5,
//         }),
//       });
//     } catch (error) {
//       console.error('Network error when contacting OpenRouter:', error);
//       return NextResponse.json(
//         { error: 'Failed to connect to OpenRouter API' },
//         { status: 500 }
//       );
//     }

//     if (!response.ok) {
//       let errorData;
//       try {
//         errorData = await response.json();
//         console.error('OpenRouter API error:', errorData);
//       } catch (e) {
//         console.error('OpenRouter API error with invalid JSON response:', await response.text());
//       }
      
//       return NextResponse.json(
//         { error: errorData?.error?.message || `OpenRouter API error: ${response.status}` },
//         { status: response.status }
//       );
//     }

//     // Parse the response
//     let data;
//     try {
//       data = await response.json();
//     } catch (error) {
//       console.error('Failed to parse OpenRouter response as JSON');
//       return NextResponse.json(
//         { error: 'Invalid response from OpenRouter API' },
//         { status: 500 }
//       );
//     }

//     // Validate response structure before accessing properties
//     if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
//       console.error('Unexpected OpenRouter API response structure:', data);
//       return NextResponse.json(
//         { error: 'Unexpected response format from OpenRouter API' },
//         { status: 500 }
//       );
//     }

//     const reply = data.choices[0].message.content;
//     return NextResponse.json({ reply });
//   } catch (error) {
//     console.error("Unhandled error in /api/sendback:", error);
//     return NextResponse.json(
//       { error: "Something went wrong!" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Parse the request body
    let requestBody: { prompt: any; };
    try {
      requestBody = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { prompt } = requestBody;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured' },
        { status: 500 }
      );
    }

    // Make request to OpenRouter
    let response;
    try {
      response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "sonar-pro",  // Or pplx-7b-chat if that's your plan
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
          temperature: 0.5,
        }),
      });
    } catch (error) {
      console.error('Network error when contacting OpenRouter:', error);
      return NextResponse.json(
        { error: 'Failed to connect to OpenRouter API' },
        { status: 500 }
      );
    }

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('OpenRouter API error:', errorData);
      } catch (e) {
        console.error('OpenRouter API error with invalid JSON response:', await response.text());
      }
      
      return NextResponse.json(
        { error: errorData?.error?.message || `OpenRouter API error: ${response.status}` },
        { status: response.status }
      );
    }

    // Parse the response
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to parse OpenRouter response as JSON');
      return NextResponse.json(
        { error: 'Invalid response from OpenRouter API' },
        { status: 500 }
      );
    }

    // Validate response structure before accessing properties
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Unexpected OpenRouter API response structure:', data);
      return NextResponse.json(
        { error: 'Unexpected response format from OpenRouter API' },
        { status: 500 }
      );
    }

    const reply = data.choices[0].message.content;
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Unhandled error in /api/sendback:", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 }
    );
  }
}