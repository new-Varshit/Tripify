import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: process.env.DEEPSEEK_API_KEY,
});

export const askAi = async (req, res) => {
  const { question, context } = req.body;

  if (!question) {
    return res.status(400).send({
      success: false,
      message: "Question is required",
    });
  }

  try {
    const finalPrompt = context
      ? `${context}\n\nUser question: ${question}`
      : `User question: ${question}`;

       console.log('finalPrompt',finalPrompt);

    const completion = await openrouter.chat.send({
      model: "nex-agi/deepseek-v3.1-nex-n1:free",
      messages: [
        {
          role: "system",
          content:
            "You are Tripify AI, a travel assistant. Do not mention your model name, company, or origin. Answer clearly, concisely, and professionally using only the given context.",
        },
        {
          role: "user",
          content: finalPrompt,
        },
      ],
      stream: false, // 🚀 faster response
    });

     console.log('completion',completion);

    const response =
      completion.choices?.[0]?.message?.content || "No response from AI.";

    return res.status(200).send({
      success: true,
      response,
    });
  } catch (error) {
    console.error("AI ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Error while contacting AI service",
    });
  }
};
