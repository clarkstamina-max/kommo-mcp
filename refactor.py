import os
import re

tools_dir = r"C:\Users\Clark\.gemini\antigravity\scratch\kommo-mcp\src\tools"

def refactor_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace import { api } with getApiClient
    content = re.sub(
        r'import \{ api \} from "\.\./api/client\.js";',
        r'import { getApiClient } from "../api/client.js";',
        content
    )

    # 2. Add client_slug to schemas
    # Find all tool definitions: server.tool("name", "desc", { ... }, async (...) => {
    # It's tricky with regex, let's do a smart substitution
    
    # We need to inject client_slug into the schema block
    # Schema block starts with '{' after the description string
    
    # Instead of complex regex, let's just do a manual sub for the api calls
    # Find `await api.` and replace with `const api = getApiClient(client_slug);\n        const response = await api.`
    # Wait, client_slug needs to come from the parameters.

    return content

# Actually, writing a reliable AST transform in Python is hard.
