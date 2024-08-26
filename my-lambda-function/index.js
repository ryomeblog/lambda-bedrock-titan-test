import {
    BedrockRuntimeClient,
    InvokeModelCommand,
  } from "@aws-sdk/client-bedrock-runtime";
  
  const client = new BedrockRuntimeClient({ region: "ap-northeast-1" });
  
  export async function handler(event) {
    const modelId = "amazon.titan-text-express-v1";
    console.log("Received event:", event);
  
    const userPrompt = event.prompt;
    console.log(userPrompt);
  
    if (!userPrompt) {
      console.error("No user prompt provided");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No user prompt provided" }),
      };
    }
  
    const payload = {
      inputText: userPrompt,
      textGenerationConfig: {
        maxTokenCount: 4096,
        temperature: 0,
      },
    };
  
    try {
      const command = new InvokeModelCommand({
        contentType: "application/json",
        body: JSON.stringify(payload),
        modelId,
      });
      const apiResponse = await client.send(command);
      const jsonString = Buffer.from(apiResponse.body).toString("utf8");
      const parsedData = JSON.parse(jsonString);
  
      console.log("API Response:", parsedData);
  
      if (parsedData.results && parsedData.results[0].outputText) {
        const text = parsedData.results[0].outputText;
        console.log("Generated text:", text);
        return {
          statusCode: 200,
          body: JSON.stringify({ text }),
        };
      } else {
        console.error("Invalid response structure");
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Invalid response structure" }),
        };
      }
    } catch (error) {
      console.error("Error calling model:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "An error occurred" }),
      };
    }
  }