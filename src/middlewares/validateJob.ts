import { Request, Response, NextFunction } from 'express';

/**
 * Express middleware to validate the body of a job request.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The Express next middleware function.
 */
export function validateJobRequest(req: Request, res: Response, next: NextFunction) {
  const { taskName, payload } = req.body;
  if (!taskName || !payload) {
    return res.status(400).json({ msg: 'Invalid request: taskName and payload are required' });
  }
  next();
}
