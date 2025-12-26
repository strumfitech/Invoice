const { onRequest } = require('firebase-functions/v2/https');
const logger = require('firebase-functions/logger');
const axios = require('axios');
const cors = require('cors');

// 🔐 CONFIG CORS
const corsHandler = cors({
  origin: [
    'http://localhost:5174',
    'http://localhost:3000',
    'https://factura-b478b.web.app',
    'https://factura-b478b.firebaseapp.com',
  ],
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
});

// 📌 CLOUD FUNCTION
exports.getFirmaByCUI = onRequest(
  {
    region: 'us-central1',
    timeoutSeconds: 60,
    memory: '256MiB',
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        // 🛑 Allow only POST
        if (req.method !== 'POST') {
          return res.status(405).json({ error: 'Method Not Allowed' });
        }

        // 🛑 Validate body
        if (!Array.isArray(req.body)) {
          return res.status(400).json({
            error: 'Request body must be an array: [{ cui: number }]',
          });
        }

        const payload = req.body.map((item) => ({
          cui: Number(item.cui),
        }));

        // 🛑 Validate CUI values
        if (payload.some((p) => !p.cui || isNaN(p.cui))) {
          return res.status(400).json({
            error: 'Invalid CUI value',
          });
        }

        logger.info('ANAF request payload', payload);

        // 📡 CALL ANAF API
        const anafResponse = await axios.post(
          'https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva',
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
            timeout: 30000,
          }
        );

        // ✅ SUCCESS
        return res.status(200).json({
          found: anafResponse.data.found || [],
          notFound: anafResponse.data.notFound || [],
        });
      } catch (error) {
        logger.error('ANAF API ERROR', error);

        return res.status(500).json({
          error: 'Internal Server Error',
          message: error.message,
        });
      }
    });
  }
);
