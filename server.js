
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });

  res.end(JSON.stringify({
    message: "Astra GPT backend is running"
  }));
});

server.listen(3000, () => {
  console.log("Astra GPT server running on port 3000");
});
