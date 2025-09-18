import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function downloadFile(url: string, filename?: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;

    if (filename) {
      link.download = filename;
    } else {
      const urlPath = new URL(url).pathname;
      const extractedFilename = urlPath.split("/").pop() || "download.pdf";
      link.download = extractedFilename;
    }

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download failed:", error);
    window.open(url, "_blank");
  }
}
