import { anthropic } from "@ai-sdk/anthropic"
import { generateText } from "ai"

const questions = [
    "How to reheat a pizza",
    "How to replace a dell chromebook keyboard",
    "How to replace a dell chromebook camera",
    "How to make brownies",
    "How to update a dell chromebook OS",
];
for (const q of questions){
const {text} = await generateText({
    model: anthropic('claude-haiku-4-5'),
    system: 'You are an IT systems assistant. You only answer questions relating to that',
    prompt: q
});
console.log(text);
}