
import { GoogleGenAI, Type } from "@google/genai";
import { AcupuncturePoint } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const queryPointsBySymptom = async (query: string): Promise<{ explanation: string, suggestedPoints: Partial<AcupuncturePoint>[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Actúa como un experto Maestro en Medicina Tradicional China. El usuario consulta: "${query}". 
      Identifica los 3-5 puntos de acupuntura más efectivos para este caso. 
      Devuelve la respuesta en formato JSON con una explicación terapéutica breve y una lista de puntos con sus nombres (ID como "LI4"), nombre común, localización, indicaciones (lista), contraindicaciones (lista), aplicaciones, beneficios energéticos, técnicas y observaciones.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            explanation: { type: Type.STRING, description: "Breve diagnóstico y razonamiento según la MTC." },
            suggestedPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Código del punto (ej. LI4, ST36)" },
                  name: { type: Type.STRING },
                  pinyin: { type: Type.STRING },
                  location: { type: Type.STRING },
                  indications: { type: Type.ARRAY, items: { type: Type.STRING } },
                  contraindications: { type: Type.ARRAY, items: { type: Type.STRING } },
                  applications: { type: Type.STRING },
                  benefits: { type: Type.STRING },
                  techniques: { type: Type.STRING },
                  observations: { type: Type.STRING }
                },
                required: ["id", "name", "location", "benefits", "techniques"]
              }
            }
          },
          required: ["explanation", "suggestedPoints"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error querying Gemini:", error);
    throw error;
  }
};

export const generatePointDiagram = async (point: AcupuncturePoint): Promise<string> => {
  try {
    const prompt = `A professional medical anatomical illustration showing the exact location of the acupuncture point ${point.id} (${point.name}) on the human body. 
    Location details: ${point.location}. 
    Context: The point belongs to the ${point.meridianName} meridian.
    Style: Professional medical atlas illustration (like Netter or Gray's), clean white background, detailed anatomy including muscles, tendons, and bones for landmark reference. 
    A clear large red dot marks the point ${point.id}. Precise and educational.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      }
    });

    for (const part of response.candidates?.[0].content.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data received");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};
