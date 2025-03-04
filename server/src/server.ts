import express from 'express';
import cors from 'cors';
import staffRoutes from './routes/staff';
import casesRoutes from './routes/cases';

const app = express();
const port = process.env.PORT || 3001;

// Fix the CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

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