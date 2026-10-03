const http = require("http");
const PORT = process.env.PORT || 3000;

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  });

  res.end(JSON.stringify(data));
}

function sendHTML(res, html) {
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });

  res.end(html);
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

function getAstraReply(message) {
  const text = message.toLowerCase().trim();

  if (/^(hi|hello|hey|hai)$/.test(text)) {
    return "Hello! 👋 I am Astra, your GLOBAL AI LEARNING assistant. Ask me about programming, AI, mathematics, technology or RRB NTPC.";
  }

  if (text.includes("python")) {
    return "🐍 Python learning path: Variables → Data Types → Operators → If/Else → Loops → Functions → Lists → Dictionaries → OOP → Projects.";
  }

  if (text.includes("java")) {
    return "☕ Java learning path: Variables → Data Types → Conditions → Loops → Methods → Arrays → Classes → Objects → OOP → Projects.";
  }

  if (
    text === "c" ||
    text.includes("c language") ||
    text.includes("learn c")
  ) {
    return "💻 C learning path: Variables → Data Types → Operators → If/Else → Loops → Arrays → Strings → Functions → Pointers → Structures → Projects.";
  }

  if (
    text === "ai" ||
    text.includes("artificial intelligence") ||
    text.includes("learn ai")
  ) {
    return "🤖 AI is the field of creating systems that can perform tasks involving learning, reasoning, language, vision and pattern recognition. You can start with Python and basic mathematics.";
  }

  if (text.includes("html")) {
    return "🌐 HTML creates the structure of webpages. Learn headings, paragraphs, links, images, forms, tables and semantic elements.";
  }

  if (text.includes("javascript") || text.includes("js")) {
    return "⚡ JavaScript adds functionality and interaction to webpages. Start with variables, functions, conditions, loops, arrays, DOM and events.";
  }

  if (text.includes("website") || text.includes("web development")) {
    return "🌐 Web development usually uses HTML for structure, CSS for design and JavaScript for functionality. Backend technologies can provide APIs and databases.";
  }

  if (text.includes("math") || text.includes("mathematics")) {
    return "📐 Send me a mathematics problem and I can explain the solution step by step.";
  }

  if (text.includes("rrb") || text.includes("ntpc")) {
    return "🚆 RRB NTPC preparation covers Mathematics, General Intelligence & Reasoning and General Awareness. I can help you learn concepts and practice questions step by step.";
  }

  if (
    text.includes("help") ||
    text.includes("what can you do")
  ) {
    return "✨ Astra can currently help with Python, Java, C, AI, HTML, JavaScript, Mathematics, Web Development and RRB NTPC.";
  }

  return "🤖 Astra received your message. Ask me about Python, Java, C, AI, HTML, JavaScript, Mathematics, Web Development or RRB NTPC.";
}

function getHealth() {
  return {
    success: true,
    service: "GLOBAL AI LEARNING",
    assistant: "Astra",
    status: "online",
    mode: "free",
    timestamp: new Date().toISOString()
  };
}

const server = http.createServer(async (req, res) => {

  // CORS preflight
  if (req.method === "OPTIONS") {
    sendJSON(res, 200, { success: true });
    return;
  }

  // Main API / health route
  if (req.method === "GET" && req.url === "/") {
    sendJSON(res, 200, getHealth());
    return;
  }

  // Health check
  if (req.method === "GET" && req.url === "/health") {
    sendJSON(res, 200, getHealth());
    return;
  }

  // API information
  if (req.method === "GET" && req.url === "/api") {
    sendJSON(res, 200, {
      success: true,
      service: "GLOBAL AI LEARNING",
      assistant: "Astra",
      status: "online",
      endpoints: {
        health: "GET /health",
        chat: "POST /api/chat",
        api: "GET /api"
      }
    });
    return;
  }

  // Astra chat API
  if (req.method === "POST" && req.url === "/api/chat") {
    try {
      const rawBody = await readBody(req);

      let body;

      try {
        body = JSON.parse(rawBody || "{}");
      } catch {
        sendJSON(res, 400, {
          success: false,
          error: "Invalid JSON request."
        });
        return;
      }

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

      const reply = getAstraReply(message);

      sendJSON(res, 200, {
        success: true,
        assistant: "Astra",
        mode: "free",
        message: message,
        reply: reply
      });

    } catch (error) {
      console.error("Astra backend error:", error);

      sendJSON(res, 500, {
        success: false,
        error: "Astra server error."
      });
    }

    return;
  }

  // Unknown route
  sendJSON(res, 404, {
    success: false,
    error: "Route not found.",
    path: req.url,
    availableRoutes: [
      "GET /",
      "GET /health",
      "GET /api",
      "POST /api/chat"
    ]
  });
});

server.listen(PORT, () => {
  console.log(
    `GLOBAL AI LEARNING Astra backend running on port ${PORT}`
  );
});

ఇప్పుడు next step

1. GitHubలో Save/Commit changes చేయి.
2. Render automatic deploy start అవుతుంది.
3. Deploy status Live అయ్యే వరకు wait చేయి.
4. తర్వాత browserలో నీ URL open చేయి:

"https://global-ai-learning-astra-6p8u.onrender.com"

Root pageలో "success: true" వస్తే backend correct.

అది వచ్చిన తర్వాత వెంటనే నాకు "Done" అని చెప్పు. అప్పుడు మనం website "index.html" ↔ Astra backend connection మొత్తం correct చేద్దాం.
