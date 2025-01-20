class DataSample {
  private json: string;
  private amount: number;
  private language: string;

  constructor(json: string, amount: number, language: string) {
    this.json = json;
    this.amount = amount;
    this.language = language;
  }

  public async generateSampleData() {
    const sampleData = [];
    const prompt = `Generate sample data based on the following DTO schema. Make sure to include realistic values for each field. 
    The sample data should be diverse and reflect typical use cases. DTO Schema: ${this.json}. Number of samples: ${this.amount}. 
    If the key type is a string, the response for this key will use ${this.language}. 
    Sensitive information such as country names, city names, names of celebrities, and company names, ... should be avoided. Object properties are placed on new lines for ease of viewing. 
    Always return format [{}, {}] if there is more than one record
    Please give me only data sample with no explanation.`;
    const data = await this.fetchOpenAI(prompt);
    return data;
  }

  private async fetchOpenAI(prompt: string) {
    const apiKey = "mo1AzcXj4Izzy9ddMU2PXhY2Rg49SIaZ5p1R4tWU75639feb";
    try {
      const response = await fetch(
        "https://ai.runsystem.work/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 1000,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim();
      } else {
        throw new Error("No choices found in response");
      }
    } catch (error) {
      console.error("Error fetching data from OpenAI API:", error);
      return "Error fetching data from OpenAI API";
    }
  }
}

export default DataSample;