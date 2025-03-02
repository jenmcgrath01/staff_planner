const express = require('express');
const cors = require('cors');
require('dotenv').config();

const casesRouter = require('./routes/cases');
const staffRouter = require('./routes/staff');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/api/cases', casesRouter);
app.use('/api/staff', staffRouter);

// Only start the server if we're not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 