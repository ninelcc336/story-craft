export interface AIProvider {
  generateCompletion(
    prompt: string,
    options?: { maxTokens?: number; temperature?: number }
  ): Promise<string>;
}
