import { Router, Request, Response } from 'express';
import { validateJobRequest } from '../middlewares/validateJob';

const router = Router();

/**
 * @route POST /api/job
 * @description Accepts a job request, validates it.
 * (Job queue functionality is currently disabled).
 * @access Private (requires JWT authentication)
 * @param {Request} req - The Express request object. Expects `taskName` and `payload` in the body.
 * @param {Response} res - The Express response object.
 */
router.post(
  '/',
  validateJobRequest,
  async (req: Request, res: Response) => {
    const { taskName, payload, app } = req.body;
    const userId = (req.user && (req.user as any).id) || 'anonymous';
    const job = {
      taskName,
      payload,
      metadata: { userId, app: app || 'UnicornXOS' },
    };
    // await jobQueue.add('user-job', job);
    res.status(202).json({ message: 'Job accepted.', job });
  }
);

export default router;
