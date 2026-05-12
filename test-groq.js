require('dotenv').config();
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function search() {
    try {
      console.log("starting groq");
      const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "You are a culinary expert. Return ONLY a valid JSON array of strings — no explanation, no markdown." },
          { role: "user", content: `List exactly 12 specific, popular varieties or dishes related to "chicken". Examples: if the input is "pasta", return things like ["Spaghetti Carbonara", "Penne Arrabbiata", "Fettuccine Alfredo", ...]. Return ONLY a JSON array of strings.` },
        ],
        temperature: 0.7,
        max_tokens: 400,
      });

      console.log("groq done, parsing");
      const raw = completion.choices[0]?.message?.content?.trim() ?? "[]";
      let names = [];
      try {
        const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        names = JSON.parse(cleaned);
      } catch (_) { names = []; }
      console.log("names:", names);
    } catch (e) {
      console.error(e);
    }
}
search();
