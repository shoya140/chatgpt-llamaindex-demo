'use client'

import { useState } from 'react'
import { useRecoilState } from 'recoil'
import {
  Button,
  HStack,
  Input,
  Select,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import { BeatLoader } from 'react-spinners'

import { ChatGPTMessage } from '@/lib/OpenAIStream'
import { gptModelState, systemPormptState } from '@/lib/RecoilState'

let messages: ChatGPTMessage[] = []

export default function Home() {
  const [messageArray, setMessageArray] = useState([] as ChatGPTMessage[])
  const [message, setMessage] = useState('')
  const [prompt, setPrompt] = useState('')
  const [gptModel, setGPTModel] = useRecoilState(gptModelState)
  const [lastGPTModel, setLastGPTModel] = useState('')
  const [systemPrompt, setSystemPrompt] = useRecoilState(systemPormptState)
  const [lastSystemPrompt, setLastSystemPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (prompt === '') {
      return
    }
    setLoading(true)

    if (gptModel !== lastGPTModel || systemPrompt !== lastSystemPrompt) {
      messages = []
      setMessageArray((prev) => [
        ...prev,
        {
          role: 'log',
          content: `Model: ${gptModel}, System Prompt: ${systemPrompt}`,
        },
      ])
    }
    setLastGPTModel(gptModel)
    setLastSystemPrompt(systemPrompt)

    messages = [...messages, { role: 'user', content: prompt }]

    setMessageArray((prev) => [...prev, { role: 'user', content: prompt }])
    setPrompt('')
    setMessage('...')

    const pattern = /^llama-(.+)$/
    const match = gptModel.match(pattern)
    const response =
      match && match[1]
        ? await fetch('http://localhost:8000/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              index: match[1],
              query: prompt,
            }),
          })
        : await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages,
              gptModel: gptModel,
              systemPrompt: systemPrompt,
            }),
          })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    const data = response.body
    if (!data) {
      return
    }

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false
    let res = ''

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      res += decoder.decode(value)
      setMessage(res)
    }

    messages = [...messages, { role: 'assistant', content: res }]
    setMessageArray((prev) => [...prev, { role: 'assistant', content: res }])
    setMessage('')
    setLoading(false)
  }

  return (
    <main>
      <div>
        <VStack mt={2} mb={12} align="start">
          {messageArray.map(({ role, content }, index) => (
            <div key={`chat-box-${index}`} className={`chat-box-${role}`}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ))}
          {message && (
            <div className="chat-box-assistant">
              <ReactMarkdown>{message}</ReactMarkdown>
            </div>
          )}
          <Textarea
            placeholder="Ask me anything."
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value)
            }}
          />
          <HStack width="full">
            <Select
              width="280px"
              value={gptModel}
              onChange={(e) => {
                setGPTModel(e.target.value)
              }}
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="llama-大阪公立大学">Llama-大阪公立大学</option>
            </Select>
            <Input
              flexGrow={1}
              placeholder="System Prompt"
              value={systemPrompt}
              onChange={(e) => {
                setSystemPrompt(e.target.value)
              }}
            />
            <Button
              onClick={sendMessage}
              width="120px"
              colorScheme="blue"
              isDisabled={prompt === '' || loading}
              isLoading={loading}
              spinner={<BeatLoader size={8} color="white" />}
            >
              Send
            </Button>
          </HStack>
        </VStack>
      </div>
    </main>
  )
}
