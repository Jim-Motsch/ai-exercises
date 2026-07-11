import * as z from "zod";
import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
const sentences = [
  "I hate the heat, thinking about moving to Portland", //city portalnd temp: cold
  "Chicago winters are brutal but honestly I love the cold", //city chicago temp cold
  "I could really go for some warm weather right about now", // city null temp warm
  "Just got back from visiting my sister in Denver", // city denver temp null
  "My chromebook won't turn on and I have homework due",
];
const temp = ["hot", "cold"]
const tempEnum = z.enum(temp)
const schema = z.object({
    city: z.string(),
    tempPreference: tempEnum.nullable()
})
for (const q of sentences){
const {object} = await generateObject({
    model: anthropic('claude-haiku-4-5'),
    prompt: q,
    schema: schema
});
console.log(object);
}
