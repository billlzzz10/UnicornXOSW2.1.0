import express, { Request, Response } from 'express';
import { fetchPrompt, PromptParams } from '../agents/PromptAgent';

const router = express.Router();

/**
 * @route POST /api/prompt
 * @description Receives parameters and uses them to generate a text prompt via the PromptAgent.
 * @access Private (requires JWT authentication)
 * @param {Request} req - The Express request object. Expects a body matching the `PromptParams` interface.
 * @param {Response} res - The Express response object.
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const params = req.body as PromptParams;
    const text = await fetchPrompt(params);
    res.json({ text });
  } catch (err: any) {
    console.error('Error in /api/prompt:', err);
    res.status(500).json({ error: err.message || 'Prompt generation failed' });
  }
});

export default router;
