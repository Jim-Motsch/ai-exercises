import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

const { text } = await generateText({
  model: anthropic('claude-haiku-4-5'),
  prompt: 'Write a vegetarian lasagna recipe',
})

console.log(text)