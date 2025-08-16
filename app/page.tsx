"use client";

import { z } from "zod";

const searchSchema = z.object({
  search: z.string(),
  location: z.string().nullable(),
});
export type SearchForm = z.infer<typeof searchSchema>;
export default function Home() {
  return <></>;
}
