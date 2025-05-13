import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});


async function generateMermaidCode(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Convert this to Mermaid.js flowchart:\n${prompt}`
  });
  console.log(extractMermaidCode(response.text));
  return response.text;
}

function extractMermaidCode(text) {
  const match = text.match(/```mermaid([\s\S]*?)```/);
  if (match) {
    return match[1].trim();
  }
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