const functions = require("firebase-functions");
const fetch = require("node-fetch");

exports.getFirmaByCUI = functions
  .region("us-central1")
  .https.onRequest(async (req, res) => {

    // =========================
    // ✅ CORS HEADERS
    // =========================
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // =========================
    // ✅ PRE-FLIGHT
    // =========================
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    // =========================
    // ❌ ONLY POST
    // =========================
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const { cui } = req.body;

      if (!cui || isNaN(cui)) {
        return res.status(400).json({ error: "CUI invalid" });
      }

      const anafResponse = await fetch(
        "https://webservicesp.anaf.ro/PlatitorTvaRest/api/v8/ws/tva",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify([{ cui, data: new Date().toISOString().slice(0, 10) }]),
        }
      );

      const data = await anafResponse.json();

      return res.status(200).json(data);

    } catch (err) {
      console.error("ANAF error:", err);
      return res.status(500).json({ error: "Eroare ANAF" });
    }
  });
