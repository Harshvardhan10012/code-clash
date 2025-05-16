// src/ai/flows/generate-test-cases.ts
'use server';
/**
 * @fileOverview Generates test cases for a given coding challenge.
 *
 * - generateTestCases - A function that generates test cases.
 * - GenerateTestCasesInput - The input type for the generateTestCases function.
 * - GenerateTestCasesOutput - The return type for the generateTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesInputSchema = z.object({
  codeChallengeDescription: z
    .string()
    .describe('The description of the coding challenge.'),
  programmingLanguage: z.string().describe('The programming language of the challenge.'),
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

const TestCaseSchema = z.object({
  input: z.string().describe('The input for the test case.'),
  expectedOutput: z.string().describe('The expected output for the test case.'),
});

const GenerateTestCasesOutputSchema = z.object({
  testCases: z.array(TestCaseSchema).describe('The generated test cases.'),
});
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;

export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are an expert software engineer. Generate test cases for the following coding challenge. The test cases should be comprehensive and cover various scenarios, including edge cases and invalid inputs.

Coding Challenge Description: {{{codeChallengeDescription}}}
Programming Language: {{{programmingLanguage}}}

Test Cases (as a JSON array of TestCase objects):
`,
});

const generateTestCasesFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFlow',
    inputSchema: GenerateTestCasesInputSchema,
    outputSchema: GenerateTestCasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
