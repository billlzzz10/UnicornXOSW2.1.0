import { InferenceClient } from '@huggingface/inference';

// Initialize Hugging Face Inference client using API token from environment
const hfToken = process.env.HF_API_TOKEN;
if (!hfToken) {
  throw new Error('HF_API_TOKEN environment variable is not set.');
}
const client = new InferenceClient({ token: hfToken });

/**
 * Defines the structure for parameters used in prompt generation.
 */
export interface PromptParams {
  /** A seed for generating reproducible results. */
  seed?: number;
  /** The gender to be used in the prompt. */
  gender?: 'male' | 'female';
  /** A custom string to be included in the prompt. */
  custom?: string;
}

/**
 * Fetches a text prompt from a Hugging Face text-generation model.
 * @param {PromptParams} params - The parameters for generating the prompt.
 * @returns {Promise<string>} A promise that resolves to the generated text.
 */
export async function fetchPrompt(params: PromptParams): Promise<string> {
  const { seed = 0, gender = 'female', custom = '' } = params;

  const inputText = `${custom} seed=${seed} gender=${gender}`.trim();

  const response = await client.textGeneration({
    model: 'bigcode/deepseek-free',
    inputs: inputText,
    parameters: { max_new_tokens: 50 }
  });

  return response.generated_text;
}
