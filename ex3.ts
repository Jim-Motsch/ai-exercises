import * as z from "zod";
import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
const sentences = [
  "dell laptops at Lincoln from 2022",
  "ipads older than 2021",
  "everything at the highschool"
];
const temp = ["hot", "cold"]
const tempEnum = z.enum(temp)
const schema = z.object({
    city: z.string(),
    tempPreference: tempEnum.nullable()
})
const schema2 = z.object({
    school: z.string().nullable(),
    model: z.string().nullable(),
    yearMin: z.number().nullable(),
    yearMax: z.number().nullable()
})
for (const q of sentences){
const {object} = await generateObject({
    model: anthropic('claude-haiku-4-5'),
    prompt: q,
    schema: schema2
});
console.log(object);
}
