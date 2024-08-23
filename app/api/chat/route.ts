import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  console.log('Received POST request to /api/chat');
  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log('API Key present:', !!apiKey);

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set in the environment variables');
    return NextResponse.json({ error: 'API key is missing' }, { status: 500 });
  }

  const anthropic = new Anthropic({
    apiKey: apiKey,
  });
  console.log('Anthropic client initialized');

  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

    console.log('Sending request to Anthropic API');
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      messages: body.messages,
    });
    console.log('Received response from Anthropic API');

    const replyText = response.content[0].type === 'text' ? response.content[0].text : '';
    console.log('Reply text:', replyText);

    return NextResponse.json({ reply: replyText }, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}