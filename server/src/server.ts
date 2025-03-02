import express from 'express';
import cors from 'cors';
import staffRoutes from './routes/staff';
import casesRoutes from './routes/cases';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/staff', staffRoutes);
app.use('/api/cases', casesRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;