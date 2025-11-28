import { GoogleGenAI } from "@google/genai";
import { Category, Difficulty } from "../types";

// Initialize Gemini Client
// NOTE: Using the API Key from environment variable as required.
// In a real deployed environment, this key would be securely managed.
const apiKey = process.env.API_KEY || 'dummy-key'; 
const ai = new GoogleGenAI({ apiKey });

interface GeneratedAirdropData {
  description: string;
  category: Category;
  difficulty: Difficulty;
  tasks: string[];
}

export const generateAirdropDetails = async (name: string, chain: string): Promise<GeneratedAirdropData> => {
  try {
    const prompt = `
      Generate realistic details for a crypto airdrop project named "${name}" on the "${chain}" chain.
      
      Return ONLY a JSON object with the following structure:
      {
        "description": "A short, engaging marketing description (max 2 sentences)",
        "category": "One of: DeFi, NFT, Gaming, Layer 2, Meme, Wallet",
        "difficulty": "One of: Easy, Medium, Hard",
        "tasks": ["Array of 3-4 short actionable tasks like 'Bridge ETH', 'Follow Twitter'"]
      }
      Do not include markdown formatting like \`\`\`json. Just the raw JSON string.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text.trim();
    // Clean potential markdown blocks if the model ignores the instruction
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
    
    const data = JSON.parse(jsonStr);

    // Validate enum mapping roughly
    let category = Category.DEFI;
    if (Object.values(Category).includes(data.category)) category = data.category;

    let difficulty = Difficulty.MEDIUM;
    if (Object.values(Difficulty).includes(data.difficulty)) difficulty = data.difficulty;

    return {
      description: data.description || "Exciting new opportunity in the crypto space.",
      category,
      difficulty,
      tasks: data.tasks || ["Interact with protocol"]
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data if API fails or key is missing
    return {
      description: `Explore the new ${name} ecosystem on ${chain}. Potential rewards for early adopters.`,
      category: Category.DEFI,
      difficulty: Difficulty.MEDIUM,
      tasks: ["Connect Wallet", "Perform a transaction", "Join Discord"]
    };
  }
};