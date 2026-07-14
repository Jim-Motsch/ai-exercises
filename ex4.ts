import * as z from "zod";
import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
type Device = {
  assetTag: string;
  name: string;
  model: string;
  purchaseYear: number;
  location: string;
};

const devices: Device[] = [
  { assetTag: "CB-1001", name: "Dell Latitude 3120",  model: "Dell Latitude",  purchaseYear: 2021, location: "Lincoln Elementary" },
  { assetTag: "CB-1002", name: "Dell Latitude 3120",  model: "Dell Latitude",  purchaseYear: 2022, location: "Lincoln Elementary" },
  { assetTag: "CB-1003", name: "Dell Latitude 3140",  model: "Dell Latitude",  purchaseYear: 2023, location: "High School" },
  { assetTag: "CB-1004", name: "Dell Chromebook 3110", model: "Dell Chromebook", purchaseYear: 2020, location: "High School" },
  { assetTag: "CB-1005", name: "Dell Chromebook 3110", model: "Dell Chromebook", purchaseYear: 2024, location: "Washington Middle" },
  { assetTag: "CB-2001", name: "Lenovo 500e Gen 3",   model: "Lenovo 500e",    purchaseYear: 2022, location: "High School" },
  { assetTag: "CB-2002", name: "Lenovo 500e Gen 3",   model: "Lenovo 500e",    purchaseYear: 2022, location: "Washington Middle" },
  { assetTag: "CB-2003", name: "Lenovo 500e Gen 4",   model: "Lenovo 500e",    purchaseYear: 2024, location: "Lincoln Elementary" },
  { assetTag: "IP-3001", name: "iPad 9th Gen",        model: "iPad",           purchaseYear: 2021, location: "Lincoln Elementary" },
  { assetTag: "IP-3002", name: "iPad 9th Gen",        model: "iPad",           purchaseYear: 2021, location: "Washington Middle" },
  { assetTag: "IP-3003", name: "iPad 10th Gen",       model: "iPad",           purchaseYear: 2023, location: "High School" },
  { assetTag: "IP-3004", name: "iPad 10th Gen",       model: "iPad",           purchaseYear: 2024, location: "Lincoln Elementary" },
  { assetTag: "MB-4001", name: "MacBook Air M1",      model: "MacBook Air",    purchaseYear: 2020, location: "District Office" },
  { assetTag: "MB-4002", name: "MacBook Air M2",      model: "MacBook Air",    purchaseYear: 2023, location: "District Office" },
  { assetTag: "CB-1006", name: "Dell Chromebook 3110", model: "Dell Chromebook", purchaseYear: 2019, location: "Storage" },
];
const schema = z.object({
    location: z.string().nullable(),
    model: z.string().nullable(),
    yearMin: z.number().nullable(),
    yearMax: z.number().nullable()
})
  const {object} = await generateObject({
    model: anthropic('claude-haiku-4-5'),
    prompt: 'how many ipads are there',
    system: "You extract search filters from questions about a school device inventory. Extract any device model, location, or year constraints mentioned — regardless of whether the question asks to list, count, or describe devices.",
    schema: schema
});
type Filters = {
  location: string | null;
  model: string | null;
  yearMin: number | null;
  yearMax: number | null;
};
function filterDevices(devices: Device[], filters: Filters) {
  return devices.filter((d) => {
    const modelOk    = filters.model === null || d.model.toLowerCase().includes(filters.model.toLowerCase());
    const locationOk = filters.location === null || d.location.toLowerCase().includes(filters.location.toLowerCase());
    const yearMinOk  = filters.yearMin === null || d.purchaseYear >= filters.yearMin;
    const yearMaxOk  = filters.yearMax === null || d.purchaseYear <= filters.yearMax;

    return modelOk && locationOk && yearMinOk && yearMaxOk;
  });
}

// after your generateObject call:
const matches = filterDevices(devices, object);
console.log(`${matches.length} match(es):`);
console.log(matches);
