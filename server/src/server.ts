import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Your existing API routes will go here
app.get('/api/staff', (req, res) => {
  res.json([]);  // Temporary empty response
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});