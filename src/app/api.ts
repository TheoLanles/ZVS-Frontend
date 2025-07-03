import { NextResponse } from "next/server";

export type Video = {
  id: string;
  title: string;
  hls_url: string;
  preview_url: string | null;
};

// Handler pour GET /videos (API route Next.js)
export async function GET() {
  // À remplacer par une vraie récupération de données (ex: lecture du dossier hls/)
  return NextResponse.json([]);
} 