import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resumeUrl = searchParams.get("resumeUrl");
  
    try {
      if (resumeUrl) {
        console.log(`[Webhook Proxy] Resuming via URL:`, resumeUrl);
        let response = await fetch(resumeUrl, { method: "GET" });
        const text = await response.text();
        console.log(`[Webhook Proxy] GET Resume Response [${response.status}]:`, text);
        let responseData;
        try { responseData = JSON.parse(text); } catch (e) { responseData = { message: text }; }

        return NextResponse.json({
          success: response.ok,
          status: response.status,
          data: responseData,
          videoUrl: responseData.videoUrl || responseData.video_url || (Array.isArray(responseData) ? responseData[0]?.videoUrl || responseData[0]?.video_url : null),
          workflowStatus: responseData.status || (Array.isArray(responseData) ? responseData[0]?.status : null),
          message: response.ok ? "Workflow resumed successfully" : "Workflow resume failed"
        });
      }

      const webhookId = "9e4d7405-ea46-497e-95f4-c5b39f30d461";
      const url = `https://n8n.aigoconsult.com/webhook-test/${webhookId}`;
      const res = await fetch(url, { method: "GET" });
      const text = await res.text();
      console.log(`[Webhook Proxy] GET Initial Response [${res.status}]:`, text);
      let data;
      try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

      return NextResponse.json({
        success: res.ok,
        status: res.status,
        data: data,
        videoUrl: data?.videoUrl || data?.video_url || (Array.isArray(data) ? data[0]?.videoUrl || data[0]?.video_url : null),
        workflowStatus: data?.status || (Array.isArray(data) ? data[0]?.status : null),
      });
    } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const resumeUrl = searchParams.get("resumeUrl");
  const contentType = request.headers.get("content-type") || "";
  
    try {
      let body: any;
      
      // Improved proxying logic: If it's multipart/form-data, use formData()
      if (contentType.includes("multipart/form-data")) {
        const formData = await request.formData();
        console.log(`[Webhook Proxy] FormData received:`, Array.from(formData.keys()));
        body = formData;
      } else {
        const buffer = await request.arrayBuffer();
        console.log(`[Webhook Proxy] Body received, size: ${buffer.byteLength}`);
        body = buffer;
      }

      const webhookId = "9e4d7405-ea46-497e-95f4-c5b39f30d461";
      const targetUrl = resumeUrl || `https://n8n.aigoconsult.com/webhook-test/${webhookId}`;
      
      console.log(`[Webhook Proxy] Proxying POST to: ${targetUrl}`);

      const fetchOptions: RequestInit = {
        method: "POST",
        body: body,
      };

      if (!contentType.includes("multipart/form-data")) {
        fetchOptions.headers = { "content-type": contentType };
      }

      let res = await fetch(targetUrl, fetchOptions);
      
      if (res.status === 405 && resumeUrl) {
        console.log(`[Webhook Proxy] Method Not Allowed on resume URL, retrying with GET`);
        res = await fetch(targetUrl, { method: "GET" });
      }

      const text = await res.text();
      console.log(`[Webhook Proxy] Response [${res.status}]:`, text);
      let data;
      try { data = JSON.parse(text); } catch (e) { data = { message: text }; }

      return NextResponse.json({
        success: res.ok,
        status: res.status,
        data: data,
        videoUrl: data?.videoUrl || data?.video_url || (Array.isArray(data) ? data[0]?.videoUrl || data[0]?.video_url : null),
        workflowStatus: data?.status || (Array.isArray(data) ? data[0]?.status : null),
      });
    } catch (error) {
    console.error("[API Error]", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
