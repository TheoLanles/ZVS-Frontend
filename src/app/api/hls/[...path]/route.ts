export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const path = params.path.join("/");
  const backendUrl = `http://localhost:5000/hls/${path}`;
  const res = await fetch(backendUrl);
  const contentType = res.headers.get("content-type") || "application/octet-stream";
  const body = await res.arrayBuffer();
  const response = new NextResponse(body, {
    status: res.status,
    headers: {
      "content-type": contentType,
      "access-control-allow-origin": "*",
    },
  });
  return response;
} 