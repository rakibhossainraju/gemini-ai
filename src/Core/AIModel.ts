import "dotenv";
import {GenerateContentStreamResult, GenerativeModel, GoogleGenerativeAI} from "npm:@google/generative-ai";

class AIModel {
  private readonly GOOGLE_GENERATIVE_API_KEY: string;
  private readonly model: GenerativeModel;
  private readonly genAI: GoogleGenerativeAI;

  constructor() {
    this.GOOGLE_GENERATIVE_API_KEY = Deno.env.get("GOOGLE_GENERATIVE_API_KEY")!;

    if (!this.GOOGLE_GENERATIVE_API_KEY) {
      throw new Error(
        "Google Generative AI API Key is not set in environment variables",
      );
    }

    this.genAI = new GoogleGenerativeAI(this.GOOGLE_GENERATIVE_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateText(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
  async generateContentStream(prompt: string): Promise<GenerateContentStreamResult> {
    return await this.model.generateContentStream(prompt);
  }
}

export default AIModel;