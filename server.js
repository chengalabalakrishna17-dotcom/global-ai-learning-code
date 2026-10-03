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

  if (
    text.includes("hello") ||
    text.includes("hi") ||
    text.includes("hey")
  ) {
    return "Hello! 👋 I am Astra, your GLOBAL AI LEARNING assistant. I can help you learn programming, AI, mathematics and technology.";
  }

  if (text.includes("python")) {
    return "🐍 Python is a beginner-friendly programming language. Start with variables, data types, if-else, loops, functions, lists and dictionaries.";
  }

  if (text.includes("java")) {
    return "☕ Java is a powerful programming language used for applications, backend systems and Android development. Start with variables, conditions, loops, methods and classes.";
  }

  if (text.includes("c language") || text === "c" || text.includes("learn c")) {
    return "💻 C is a fundamental programming language. Start with variables, data types, operators, if-else, loops, arrays, strings, functions and pointers.";
  }

  if (
    text.includes("artificial intelligence") ||
    text === "ai" ||
    text.includes("learn ai")
  ) {
    return "🤖 Artificial Intelligence means building computer systems that can perform tasks that normally require human intelligence, such as understanding language, recognizing patterns and making predictions.";
  }

  if (
    text.includes("html") ||
    text.includes("website")
  ) {
    return "🌐 HTML creates the structure of a webpage. CSS controls its appearance and JavaScript adds interaction and functionality.";
  }

  if (
    text.includes("javascript") ||
    text.includes("js")
  ) {
    return "⚡ JavaScript makes websites interactive. You can use it for buttons, forms, games, web applications and much more.";
  }

  if (
    text.includes("math") ||
    text.includes("mathematics")
  ) {
    return "📐 I can help you with mathematics step by step. Send me the exact problem you want to learn.";
  }

  if (
    text.includes("rrb") ||
    text.includes("ntpc")
  ) {
    return "🚆 RRB NTPC preparation includes Mathematics, Reasoning and General Awareness. I can help you understand concepts and practice questions step by step.";
  }

  if (
    text.includes("help") ||
    text.includes("what can you do")
  ) {
    return "✨ I am Astra. Try asking about Python, Java, C Language, AI, HTML, JavaScript, Mathematics or RRB NTPC.";
  }

  return "🤖 Astra received your message. I can currently help with Python, Java, C Language, AI, HTML, JavaScript, Mathematics and RRB NTPC. Try asking me about one of these topics.";
}

const server = http.createServer(async (req, res) => {

  if (req.method === "OPTIONS") {
    sendJSON(res, 200, {
      success: true
    });
    return;
  }

  if (req.method === "GET" && req.url === "/") {
    sendJSON(res, 200, {
      success: true,
      service: "GLOBAL AI LEARNING",
      assistant: "Astra",
      status: "online",
      mode: "free"
    });
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {

    try {
      const rawBody = await readBody(req);

      let body;

      try {
        body = JSON.parse(rawBody);
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

  sendJSON(res, 404, {
    success: false,
    error: "Route not found."
  });

});

server.listen(PORT, () => {
  console.log(
    `GLOBAL AI LEARNING Astra free backend running on port ${PORT}`
  );
});
