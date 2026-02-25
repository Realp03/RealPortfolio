export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    return;
  }

  const body = req.body && typeof req.body === "object" ? req.body : {};
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const history = Array.isArray(body.history) ? body.history : [];

  if (!message || message.length > 1500) {
    res.status(400).json({ error: "Invalid message" });
    return;
  }

  const system = `You are Mark Daryl Pineda replying to visitors on your personal portfolio website.

IDENTITY:
You ARE Mark. Never say you are an AI, assistant, bot, or model.

PERSONALITY:
Natural Taglish, confident, medyo pilosopo minsan (witty, not rude). Friendly but professional.

RULES:
Speak in first-person ("ako", "ko"). Do NOT invent skills/experience/projects. Only use facts below.
If outside the facts, say it's not part of your portfolio yet. Keep answers short (2–5 sentences). No markdown.

FACTS:
Name: Mark Daryl Pineda
BSIT 4th year, Quezon City University
Frontend: HTML, CSS, JavaScript, React, Tailwind, Vite
Backend: PHP, MySQL, Java, VB.Net
Hardware: Hardware Troubleshooting, System Installation
Projects: ReaPlaylist https://reaplaylist.vercel.app | Gallereal https://gallereal.42web.io/gallery.php | Resume Builder https://realsumebuilder.vercel.app
Contact: pinedamarkdaryl@gmail.com | FB https://web.facebook.com/TheReal2004 | IG https://www.instagram.com/realp03/`;

  const contents = [];
  contents.push({ role: "user", parts: [{ text: system }] });

  const h = history.slice(-10);
  for (const item of h) {
    const roleRaw = item && typeof item.role === "string" ? item.role : "user";
    const textRaw = item && typeof item.text === "string" ? item.text : "";
    const t = textRaw.trim();
    if (!t) continue;
    const role = roleRaw === "model" || roleRaw === "assistant" ? "model" : "user";
    contents.push({ role, parts: [{ text: t.slice(0, 1200) }] });
  }

  contents.push({ role: "user", parts: [{ text: message }] });

  const payload = {
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 180
    }
  };

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
    encodeURIComponent(apiKey);

  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await r.json().catch(() => null);

    if (!r.ok) {
      res.status(r.status || 500).json({ error: "Gemini API error", detail: data });
      return;
    }

    let text = "";
    const parts = data?.candidates?.[0]?.content?.parts;
    if (Array.isArray(parts)) {
      for (const p of parts) if (p?.text) text += String(p.text);
    }
    text = String(text || "").trim();
    if (!text) text = "Medyo nagka-error ngayon. Try mo ulit after a bit.";

    res.status(200).json({ reply: text });
  } catch (e) {
    res.status(500).json({ error: "Request failed" });
  }
}