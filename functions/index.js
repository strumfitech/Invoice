const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

/* ======================
   CORS
====================== */
app.use(cors({ origin: true }));
app.use(express.json());

/* ======================
   TEST
====================== */
app.get("/", (req, res) => {
  res.send("API OK");
});

/* ======================
   INFOCUI – getFirmaByCUI
====================== */
app.post("/getFirmaByCUI", async (req, res) => {
  try {
    const { cui } = req.body;

    if (!cui) {
      return res.status(400).json({ error: "CUI lipsă" });
    }

    const API_KEY = "f808687cefa550e54525c282da940e26ff97f6a4";

    const url = `https://www.infocui.ro/system/api/data?key=${API_KEY}&cui=${cui}`;

    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      console.error("INFOCUI HTTP ERROR:", response.status, text);
      return res.status(502).json({ error: "Infocui indisponibil" });
    }

    const data = await response.json();

    return res.json(data);
  } catch (err) {
    console.error("INFOCUI ERROR:", err);
    return res.status(500).json({ error: "Eroare server" });
  }
});

/* ======================
   EXPORT FIREBASE
====================== */
exports.api = functions
  .region("us-central1")
  .https.onRequest(app);
