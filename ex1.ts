import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

const { text } = await generateText({
  model: anthropic('claude-sonnet-4-6'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
})

console.log(text)