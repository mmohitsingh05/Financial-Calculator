export async function onRequest(context: any) {
  return new Response(
    JSON.stringify({ 
      status: "ok", 
      time: new Date().toISOString(),
      runtime: "Cloudflare Pages Functions"
    }),
    {
      headers: {
        "content-type": "application/json;charset=UTF-8",
        "access-control-allow-origin": "*"
      },
    }
  );
}
