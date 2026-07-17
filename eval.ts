import * as z from "zod";
import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"


const testCases = [
  // Basics you already verified by hand
  { question: "dell laptops at lincoln from 2022", expected: { location: "lincoln", model: "dell", yearMin: 2022, yearMax: 2022 } },
  { question: "how many ipads are there", expected: { location: null, model: "ipad", yearMin: null, yearMax: null } },
  { question: "dell laptops at lincoln", expected: { location: "lincoln", model: "dell", yearMin: null, yearMax: null } },

  // The ambiguous "older than" case — pin the interpretation
  { question: "ipads older than 2021", expected: { location: null, model: "ipad", yearMin: null, yearMax: 2020 } },

  // Location-only, model-only, year-only (single-filter isolation)
  { question: "everything at the high school", expected: { location: "high school", model: null, yearMin: null, yearMax: null } },
  { question: "how many lenovo 500e do we have", expected: { location: null, model: "lenovo", yearMin: null, yearMax: null } },  { question: "what was purchased in 2022", expected: { location: null, model: null, yearMin: 2022, yearMax: 2022 } },

  // Total noise — the all-nulls guard case
  { question: "what's the weather like today", expected: { location: null, model: null, yearMin: null, yearMax: null } },

  // Case sensitivity traps
  { question: "DELL laptops", expected: { location: null, model: "dell", yearMin: null, yearMax: null } },
  { question: "chromebooks at Washington Middle", expected: { location: "washington middle", model: "chromebook", yearMin: null, yearMax: null } },

  // Year range phrasing variety
  { question: "devices from 2020 to 2023", expected: { location: null, model: null, yearMin: 2020, yearMax: 2023 } },
  { question: "anything before 2021", expected: { location: null, model: null, yearMin: null, yearMax: 2020 } },
  { question: "devices from 2022 or newer", expected: { location: null, model: null, yearMin: 2022, yearMax: null } },

  // Combined filters, three at once
  { question: "iPads at the high school from 2023", expected: { location: "high school", model: "ipad", yearMin: 2023, yearMax: 2023 } },

  // Plural/singular variance
  { question: "MacBooks at the district office", expected: { location: "district office", model: "macbook", yearMin: null, yearMax: null } },

  // Ambiguous phrasing — decide what "recent" means and pin it
  { question: "recently purchased devices", expected: { location: null, model: null, yearMin: null, yearMax: null } },
  // A location that's also a common word — stress test
  { question: "what's in storage", expected: { location: "storage", model: null, yearMin: null, yearMax: null } },
];
const schema = z.object({
    location: z.string().nullable(),
    model: z.string().nullable().describe(
      "the core device model or manufacturer only, e.g. 'dell', 'ipad', 'chromebook' — not generic words like 'laptop', 'device', or 'tablet'"
    ),
    yearMin: z.number().nullable(),
    yearMax: z.number().nullable()
})
const system="You extract search filters from questions about a school device inventory. Extract any device model, location, or year constraints mentioned — regardless of whether the question asks to list, count, or describe devices.";

  let passed = 0;
    for (const { question, expected } of testCases) {
    const { object } = await generateObject({ model: anthropic('claude-haiku-4-5'), system, schema, prompt: question });
    const isMatch =
        (object.location?.toLowerCase() ?? null) === (expected.location?.toLowerCase() ?? null) &&
        (object.model?.toLowerCase() ?? null) === (expected.model?.toLowerCase() ?? null) &&
        object.yearMin === expected.yearMin &&
        object.yearMax === expected.yearMax;
            console.log(isMatch ? "PASS" : "FAIL", question, isMatch ? "" : object);
            if (isMatch) passed++;
    }
console.log(`${passed}/${testCases.length} passing`);



// after your generateObject call:

