import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async generateScript(topic: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Crie um roteiro viral para um vídeo curto sobre: ${topic}. O roteiro deve ser envolvente, ter um gancho forte e ser otimizado para TikTok/Reels. Retorne em formato JSON com as chaves: title, hook, body, callToAction.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            body: { type: Type.STRING },
            callToAction: { type: Type.STRING },
          },
          required: ["title", "hook", "body", "callToAction"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async generateImage(prompt: string) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: `A high-quality professional graphic design for: ${prompt}. Modern, viral style, vibrant colors.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  },

  async generateVoice(text: string) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Diga de forma animada e profissional: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/wav;base64,${base64Audio}`;
    }
    return null;
  },

  async analyzeVideoMoments(videoDescription: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise este vídeo (descrição: ${videoDescription}) e identifique os 3 momentos mais virais para transformar em Shorts. Retorne um array de objetos com: start_time, end_time, reason, suggested_title.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              start_time: { type: Type.STRING },
              end_time: { type: Type.STRING },
              reason: { type: Type.STRING },
              suggested_title: { type: Type.STRING },
            },
            required: ["start_time", "end_time", "reason", "suggested_title"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  }
};
