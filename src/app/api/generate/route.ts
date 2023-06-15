import {
  OpenAIStream,
  OpenAIStreamPayload,
  ChatGPTMessage,
} from '@/lib/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing env var from OpenAI')
}

export const runtime = 'edge'

export async function POST(req: Request): Promise<Response> {
  const { messages, gptModel, systemPrompt } = (await req.json()) as {
    messages?: ChatGPTMessage[]
    gptModel?: string
    systemPrompt?: string
  }

  if (!messages || !gptModel || !systemPrompt) {
    return new Response('No prompt/model in the request', { status: 400 })
  }

  const payload: OpenAIStreamPayload = {
    model: gptModel,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages.slice(messages.length - 7),
    ],
    temperature: 0,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: true,
    n: 1,
  }

  const stream = await OpenAIStream(payload)
  return new Response(stream)
}
