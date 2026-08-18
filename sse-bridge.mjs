import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import readline from "readline";

async function main() {
  const url = process.argv[2] || "https://kommo-mcp.stamina.digital/sse";
  const transport = new SSEClientTransport(new URL(url));
  
  transport.onmessage = (msg) => {
    // Print exactly the JSON message to stdout so the IDE can read it
    console.log(JSON.stringify(msg));
  };
  
  transport.onerror = (err) => {
    console.error("SSE Transport Error:", err);
  };
  
  transport.onclose = () => {
    process.exit(0);
  };

  await transport.start();

  // Read JSON-RPC from stdin (IDE) and send to SSE (Server)
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  rl.on('line', async (line) => {
    if (!line.trim()) return;
    try {
      const msg = JSON.parse(line);
      await transport.send(msg);
    } catch (e) {
      console.error("Error forwarding message:", e);
    }
  });
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
