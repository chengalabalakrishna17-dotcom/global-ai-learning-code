const http = require("http");

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = "gpt-6-luna";

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();

      if (body.length > 100000) {
        reject(new Error("Request too large"));
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {

  if (req.method === "OPTIONS") {
    sendJSON(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    sendJSON(res, 200, {
      success: true,
      service: "GLOBAL AI LEARNING",
      assistant: "Astra",
      status: "online"
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {

    if (!OPENAI_API_KEY) {
      sendJSON(res, 500, {
        success: false,
        error: "OPENAI_API_KEY is not configured."
      });
      return;
    }

    try {
      const rawBody = await readBody(req);
      const body = JSON.parse(rawBody);

      const message =
        typeof body.message === "string"
          ? body.message.trim()
          : "";

      if (!message) {
        sendJSON(res, 400, {
          success: false,
          error: "Message is required."
        });
        return;
      }

      const response = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: OPENAI_MODEL,
            instructions:
              "You are Astra, the AI learning assistant of GLOBAL AI LEARNING. " +
              "Teach programming, AI, technology, mathematics and other educational subjects. " +
              "Explain clearly and step by step.",
            input: message
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        sendJSON(res, response.status, {
          success: false,
          error: result?.error?.message || "OpenAI request failed."
        });
        return;
      }

      sendJSON(res, 200, {
        success: true,
        assistant: "Astra",
        reply:
          result.output_text ||
          "Astra could not generate a response."
      });

    } catch (error) {
      sendJSON(res, 500, {
        success: false,
        error: error.message
      });
    }

    return;
  }

  sendJSON(res, 404, {
    success: false,
    error: "Route not found."
  });
});

server.listen(PORT, () => {
  console.log(
    `GLOBAL AI LEARNING Astra backend running on port ${PORT}`
  );
});

