import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const res = await fetch("http://localhost:5000/videos");
  const data = await res.json();

  // Récupère l'id dans l'URL (ex: /api/videos?id=video1)
  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    const found = data.find((video: any) => video.id === id);
    if (found) {
      return NextResponse.json(found);
    } else {
      return NextResponse.json(
        { error: "Video not found" },
        { status: 404 }
      );
    }
  }

  return NextResponse.json(data);
}