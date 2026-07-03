import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

// ===== בדיקת זמינות (כרגע מדומה) =====
async function checkAvailability(date, time, guests) {
  return true; // בהמשך נחבר ל-Google Calendar
}

// ===== WhatsApp Cloud API =====
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const WHATSAPP_RECIPIENTS = [
  "17866656827" // המספר שלך
];

async function sendWhatsAppMessage(text) {
  const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

  for (const to of WHATSAPP_RECIPIENTS) {
    await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      })
    });
  }
}

// ===== ראוט הזמנה =====
app.post("/reserve", async (req, res) => {
  try {
    const { name, phone, date, time, guests } = req.body;

    const available = await checkAvailability(date, time, guests);

    if (!available) {
      return res.json({ available: false });
    }

    const text =
      `הזמנה חדשה מהאתר:\n` +
      `שם: ${name}\n` +
      `טלפון: ${phone}\n` +
      `תאריך: ${date}\n` +
      `שעה: ${time}\n` +
      `מספר סועדים: ${guests}\n` +
      `סטטוס: אושר אוטומטית.`;

    await sendWhatsAppMessage(text);

    res.json({ available: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ available: false });
  }
});

// ===== הפעלת השרת =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
