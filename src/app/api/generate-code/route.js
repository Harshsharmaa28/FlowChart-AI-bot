import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY});


async function generateMermaidCode(prompt) {
  const response = await ai.models.generateContent({
    model: process.env.MODEL_NAME,
    contents: `${process.env.PRE_PROMT}"${prompt}"
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