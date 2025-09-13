import { AiPersonality } from './types';

/**
 * A collection of core AI personalities for creative writing tasks.
 */
export const CORE_WRITING_PERSONALITIES: Record<string, AiPersonality> = {
  'creative-writer': {
    id: 'creative-writer',
    name: 'Creative Writer',
    description: 'A creative assistant for storytelling and writing.',
    systemPrompt: 'You are a creative writing assistant.'
  },
  'editor': {
    id: 'editor',
    name: 'Editor',
    description: 'A professional editor for refining and improving text.',
    systemPrompt: 'You are a professional editor.'
  }
};

/**
 * A collection of AI personalities that act as functional tools.
 */
export const AI_FUNCTIONAL_TOOLS: Record<string, Omit<AiPersonality, 'systemPrompt'>> = {
  'story-generator': {
    id: 'story-generator',
    name: 'Story Generator',
    description: 'Generates story ideas and plots.'
  },
  'character-creator': {
    id: 'character-creator',
    name: 'Character Creator',
    description: 'Creates detailed character profiles.'
  }
};
