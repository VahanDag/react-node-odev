const express = require('express');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const { sequelize, testConnection } = require('./config/database');
const accountRoutes = require('./routes/accountRoutes');
const syncService = require('./services/syncService');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      'https://company-tracker-frontend.netlify.app',
      'http://localhost:5173',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

app.options('*', cors());

app.use('/api', accountRoutes);

app.use(
  express.static(
    path.join(__dirname, '../../..', 'react-node-odev/frontend/dist'),
  ),
);

app.get('*', (req, res) => {
  res.sendFile(
    path.join(
      __dirname,
      '../../..',
      'react-node-odev/frontend/dist/index.html',
    ),
  );
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

const startServer = async () => {
  try {
    await testConnection();

    await sequelize.sync({ force: true });
    console.log('Database tables created successfully');

    try {
      await syncService.syncAccounts();
      console.log('Initial synchronization completed');
    } catch (error) {
      console.error('Initial sync failed:', error);
    }

    cron.schedule('*/5 * * * *', async () => {
      console.log('Scheduled sync starting...');
      try {
        await syncService.syncAccounts();
        console.log('Scheduled sync completed');
      } catch (error) {
        console.error('Scheduled sync failed:', error);
      }
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
