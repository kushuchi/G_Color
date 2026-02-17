import { GoogleGenAI, Type } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAiPalette = async (keyword: string): Promise<string[]> => {
  try {
    const ai = getClient();
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a beautiful, harmonious 5-color hex code palette based on the keyword or mood: "${keyword}". Return only the hex codes.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            palette: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          },
          required: ["palette"]
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return json.palette || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
