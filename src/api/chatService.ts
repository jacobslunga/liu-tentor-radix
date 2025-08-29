export async function* streamChatResponse(
  prompt: string,
  exam_url: string,
  solution_url: string | null
) {
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

  try {
    const response = await fetch(`${apiBaseUrl}/chat/response`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        exam_url,
        solution_url,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      yield decoder.decode(value, { stream: true });
    }
  } catch (error) {
    console.error("Streaming failed:", error);
    yield "Sorry, something went wrong while getting the response.";
  }
}
