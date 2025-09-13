import express from 'express';
import cors from 'cors';
import { authenticateJWT } from './middlewares/auth';
import jobRoutes from './routes/job';
import promptRoutes from './routes/prompt';

/**
 * The main Express application instance.
 * @type {express.Application}
 */
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/job', authenticateJWT, jobRoutes);
app.use('/api/prompt', authenticateJWT, promptRoutes);

export default app;

/**
 * Starts the Express server if this file is run directly.
 */
if (require.main === module) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });
}
