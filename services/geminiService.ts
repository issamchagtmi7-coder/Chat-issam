import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from '@google/genai';

const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const isApiKeySet = (): boolean => {
  return !!API_KEY;
};

// --- Chat Service ---
let chat: Chat | null = null;

export const startChatSession = (): Chat => {
  if (!ai) throw new Error("API Key not configured.");
  chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are Issam, a helpful and knowledgeable AI assistant. You can answer any type of question.',
    }
  });
  return chat;
};

export const getChat = (): Chat => {
    if(!chat) return startChatSession();
    return chat;
}

export const sendMessageToAIStream = async (message: string): Promise<AsyncGenerator<GenerateContentResponse>> => {
  if (!ai) throw new Error("API Key not configured.");
  const currentChat = getChat();
  return currentChat.sendMessageStream({ message });
};


// --- Image Editing Service ---

export interface EditedImageResponse {
    image: string | null; // base64 string
    text: string | null;
}

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<EditedImageResponse> => {
    if (!ai) throw new Error("API Key not configured.");
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });

        const result: EditedImageResponse = { image: null, text: null };

        // The API can return multiple parts, including text and image.
        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                result.text = part.text;
            } else if (part.inlineData) {
                result.image = part.inlineData.data;
            }
        }
        
        if (!result.image) {
            throw new Error("L'API n'a pas retourné d'image modifiée.");
        }

        return result;

    } catch (error) {
        console.error("Erreur lors de l'édition de l'image:", error);
        throw new Error("Une erreur s'est produite lors de la communication avec l'API Gemini.");
    }
};
