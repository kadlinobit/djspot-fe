const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { SSEClientTransport } = require("@modelcontextprotocol/sdk/client/sse.js");

async function main() {
  const transport = new SSEClientTransport(new URL("https://ui.nuxt.com/mcp"));
  const client = new Client({
    name: "test-client",
    version: "1.0.0"
  }, {
    capabilities: {}
  });

  try {
    await client.connect(transport);
    const tools = await client.listTools();
    console.log("SUCCESS: MCP Server is reachable and providing tools:");
    console.log(JSON.stringify(tools, null, 2));
    await client.close();
    process.exit(0);
  } catch (error) {
    console.error("FAILURE: Could not connect to MCP server:");
    console.error(error);
    process.exit(1);
  }
}

main();
