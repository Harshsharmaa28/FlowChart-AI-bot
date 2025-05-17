import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});


async function generateMermaidCode(prompt) {
  const response = await ai.models.generateContent({
    model: process.env.MODEL_NAME,
    contents: `You are a Mermaid.js expert. Generate only valid Mermaid code using the "graph LR" syntax. 
          Follow these strict rules:
          1. Use only valid Mermaid syntax nodes like [Text], (Text), {Text}, ((Text)), etc.
          2. Do NOT use parentheses ( ) inside decision nodes { }, as it causes Mermaid parser errors.
          3. Ensure all node IDs are valid (letters and numbers only).
          4. Escape or replace any characters that may break Mermaid syntax (like quotes or parentheses in wrong places).
          Here is the user prompt:
          "${prompt}"
          Return only valid and parsable Mermaid syntax.`
  });
  // console.log(extractMermaidCode(response.text));
  return response.text;
}

function extractMermaidCode(text) {
  const match = text.match(/```mermaid([\s\S]*?)```/);

  if (match) return match[1].trim();
  
  const fallbackMatch = text.match(/graph\s+(TD|LR)[\s\S]*/);
  if (fallbackMatch) return fallbackMatch[0].trim();

  return null;
}



export async function POST(req) {
  const {prompt} = await req.json();
  if(!prompt) {
    return new Response(JSON.stringify({ error: "Prompt is required." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const geminiResponse = await generateMermaidCode(prompt);
  const mermaidCode = extractMermaidCode(geminiResponse);
  return new Response(JSON.stringify({ mermaidCode }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}