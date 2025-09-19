export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const apiKey =
      process.env.NIM_API_KEY || process.env.NVIDIA_NIM_API_KEY || "";
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "Server NIM_API_KEY is not configured" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const upstream = await fetch(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!upstream.ok) {
      const text = await upstream.text();
      return new Response(text || upstream.statusText, {
        status: upstream.status,
      });
    }

    // Stream the response back to the client
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type":
          upstream.headers.get("Content-Type") || "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        // CORS for dev if needed (same-origin in app, safe to omit)
        // "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Proxy error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
