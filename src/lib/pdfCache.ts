import { get, set } from "idb-keyval";
import { supabase } from "@/supabase/supabaseClient";

export async function getCachedPdf(url: string): Promise<Blob | null> {
  try {
    const cached = await get<Blob>(url);
    return cached ?? null;
  } catch (e) {
    console.error("Failed to get cached PDF", e);
    return null;
  }
}

export async function cachePdf(url: string, blob: Blob) {
  try {
    await set(url, blob);
  } catch (e) {
    console.error("Failed to cache PDF", e);
  }
}

export async function fetchPdfBlob(documentId: string): Promise<Blob> {
  const { data, error } = await supabase
    .from("documents")
    .select("content")
    .eq("id", documentId)
    .single();

  if (error || !data?.content) {
    throw new Error("Failed to fetch PDF base64 content");
  }

  const base64 = data.content;

  const binary = atob(
    base64.replace(/\s/g, "").replace(/_/g, "/").replace(/-/g, "+")
  );
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: "application/pdf" });
}

export function decodeBase64ToBlob(base64: string): Blob {
  const cleaned = base64
    .replace(/\s/g, "")
    .replace(/_/g, "/")
    .replace(/-/g, "+");

  const binary = atob(cleaned);
  const len = binary.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: "application/pdf" });
}
