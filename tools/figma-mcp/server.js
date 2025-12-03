// Minimal Figma MCP server using Model Context Protocol SDK (Node + stdio)
// Tools exposed:
// - figma.getFile: Fetch file metadata and document tree
// - figma.getNodes: Fetch specific node(s) by id
// - figma.getImages: Export image URLs for node(s) in a given format/scale

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/transports/stdio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const FIGMA_API_BASE = 'https://api.figma.com/v1';

function getAuthHeaders() {
  const token = process.env.FIGMA_TOKEN;
  if (!token) {
    throw new Error('FIGMA_TOKEN missing. Set it in tools/figma-mcp/.env');
  }
  return {
    'X-Figma-Token': token,
  };
}

function extractFileKey(input) {
  // Accepts a file key or a full URL
  if (!input) return undefined;
  if (/^[A-Za-z0-9]{20,}$/.test(input)) return input; // looks like a key
  const match = String(input).match(/figma\.com\/(?:file|design)\/([A-Za-z0-9]+)\//);
  return match ? match[1] : input;
}

async function figmaGet(path, params) {
  const url = new URL(FIGMA_API_BASE + path);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API error ${res.status}: ${text}`);
  }
  return res.json();
}

async function handleGetFile(args) {
  const { fileKeyOrUrl } = args || {};
  const key = extractFileKey(fileKeyOrUrl || process.env.FIGMA_FILE_KEY || process.env.FIGMA_FILE_URL);
  if (!key) throw new Error('fileKeyOrUrl not provided and FIGMA_FILE_KEY/FIGMA_FILE_URL not set');
  return await figmaGet(`/files/${key}`);
}

async function handleGetNodes(args) {
  const { fileKeyOrUrl, ids } = args || {};
  const key = extractFileKey(fileKeyOrUrl || process.env.FIGMA_FILE_KEY || process.env.FIGMA_FILE_URL);
  if (!key) throw new Error('fileKeyOrUrl not provided and FIGMA_FILE_KEY/FIGMA_FILE_URL not set');
  if (!ids || (Array.isArray(ids) && ids.length === 0)) throw new Error('ids is required');
  const idsParam = Array.isArray(ids) ? ids.join(',') : String(ids);
  return await figmaGet(`/files/${key}/nodes`, { ids: idsParam });
}

async function handleGetImages(args) {
  const { fileKeyOrUrl, ids, format = 'png', scale = 1 } = args || {};
  const key = extractFileKey(fileKeyOrUrl || process.env.FIGMA_FILE_KEY || process.env.FIGMA_FILE_URL);
  if (!key) throw new Error('fileKeyOrUrl not provided and FIGMA_FILE_KEY/FIGMA_FILE_URL not set');
  if (!ids || (Array.isArray(ids) && ids.length === 0)) throw new Error('ids is required');
  const idsParam = Array.isArray(ids) ? ids.join(',') : String(ids);
  return await figmaGet(`/images/${key}`, { ids: idsParam, format, scale });
}

async function main() {
  const server = new Server({ name: 'figma-mcp', version: '1.0.0' }, {
    capabilities: { tools: {} },
  });

  server.tool(
    {
      name: 'figma.getFile',
      description: 'Fetch Figma file metadata and document tree. Accepts file key or full URL.',
      inputSchema: {
        type: 'object',
        properties: {
          fileKeyOrUrl: { type: 'string' },
        },
      },
    },
    async (args) => ({ content: [{ type: 'json', json: await handleGetFile(args) }] }),
  );

  server.tool(
    {
      name: 'figma.getNodes',
      description: 'Fetch specific nodes by id from a Figma file.',
      inputSchema: {
        type: 'object',
        required: ['ids'],
        properties: {
          fileKeyOrUrl: { type: 'string' },
          ids: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
        },
      },
    },
    async (args) => ({ content: [{ type: 'json', json: await handleGetNodes(args) }] }),
  );

  server.tool(
    {
      name: 'figma.getImages',
      description: 'Get export image URLs for Figma node ids in a specified format and scale.',
      inputSchema: {
        type: 'object',
        required: ['ids'],
        properties: {
          fileKeyOrUrl: { type: 'string' },
          ids: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } },
            ],
          },
          format: { type: 'string', enum: ['png', 'jpg', 'svg', 'pdf'] },
          scale: { type: 'number' },
        },
      },
    },
    async (args) => ({ content: [{ type: 'json', json: await handleGetImages(args) }] }),
  );

  await server.connect(new StdioServerTransport());
}

main().catch((err) => {
  // Ensure MCP client receives a clear error
  console.error('[figma-mcp] fatal:', err.stack || err.message || String(err));
  process.exit(1);
});


