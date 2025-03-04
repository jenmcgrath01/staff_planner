import express from 'express';
import cors from 'cors';
import staffRoutes from './routes/staff';
import casesRoutes from './routes/cases';

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',  // dev
  'http://localhost:4173',  // preview
  'http://localhost:4174',
  'http://localhost:5174',  // additional dev port
  'https://staff-planner-client.onrender.com'  // production client URL
];

// Add this before your CORS configuration
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  if (req.method === 'POST') {
    console.log('POST body:', req.body);
  }
  next();
});

// Fix the CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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