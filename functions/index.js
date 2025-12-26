const functions = require("firebase-functions/v2/https");
const cors = require("cors")({ origin: true });

exports.getFirmaByCUI = functions.onRequest(async (req, res) => {
  cors(req, res, async () => {

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { cui } = req.body;

      if (!cui) {
        return res.status(400).json({ error: "CUI lipsă" });
      }

      // AICI logica ta existentă ANAF
      const firma = await getFirmaFromANAF(cui);

      return res.status(200).json(firma);

    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Eroare server" });
    }

  });
});
