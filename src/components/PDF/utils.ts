import { Exam } from "@/components/data-table/columns";
import { supabase } from "@/supabase/supabaseClient";

export const fetchExamData = async (tenta_id: string) => {
  const { data, error } = await supabase
    .from("tentor")
    .select("*")
    .eq("id", parseInt(tenta_id))
    .single();

  if (error) {
    throw new Error(`Error fetching exam: ${error.message}`);
  }

  return data;
};

export const fetchPdfData = async (documentId: number) => {
  const { data, error } = await supabase
    .from("documents")
    .select("content")
    .eq("id", documentId)
    .single();

  if (error) {
    throw new Error(`Error fetching PDF: ${error.message}`);
  }

  if (data && data.content) {
    const byteCharacters = atob(data.content);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const pdfBlob = new Blob([byteArray], { type: "application/pdf" });
    return URL.createObjectURL(pdfBlob);
  } else {
    throw new Error("No content found for the given document ID.");
  }
};

export const isFacit = (name: string) => {
  const normalizedName = name.normalize("NFC").toLowerCase();

  const isFacitPattern = /^l\d|^l_\d{8}/;

  const isFacitKeyword =
    normalizedName.includes("lösningsförslag") ||
    normalizedName.includes("facit") ||
    normalizedName.includes("solution") ||
    normalizedName.includes("losning") ||
    normalizedName.includes("losnings") ||
    normalizedName.includes("lösnings") ||
    normalizedName.includes("lösning") ||
    normalizedName.includes("tenlsg") ||
    normalizedName.includes("_l") ||
    (normalizedName.includes("svar") &&
      !normalizedName.includes("tenta_och_svar"));

  return isFacitPattern.test(normalizedName) || isFacitKeyword;
};

export const findFacitForExam = (exam: Exam, exams: Exam[]): Exam | null => {
  if (!exams) return null;

  const normalizeName = (name: string) =>
    name.replace(".pdf", "").toLowerCase();

  const extractDate = (name: string): string | null => {
    const normalized = normalizeName(name);

    const match = normalized.match(/(\d{4}[-_]\d{2}[-_]\d{2}|\d{8}|\d{6})/);
    if (!match) return null;

    const dateStr = match[0];

    let year, month, day;

    if (dateStr.includes("-") || dateStr.includes("_")) {
      [year, month, day] = dateStr.split(/[-_]/);
    } else if (dateStr.length === 8) {
      year = dateStr.substring(0, 4);
      month = dateStr.substring(4, 6);
      day = dateStr.substring(6, 8);
    } else if (dateStr.length === 6) {
      year = `20${dateStr.substring(0, 2)}`;
      month = dateStr.substring(2, 4);
      day = dateStr.substring(4, 6);
    } else {
      return null;
    }

    if (
      parseInt(month, 10) < 1 ||
      parseInt(month, 10) > 12 ||
      parseInt(day, 10) < 1 ||
      parseInt(day, 10) > 31
    ) {
      return null;
    }

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const examDate = extractDate(exam.tenta_namn);
  if (!examDate) return null;

  const facit = exams.find((e) => {
    const facitDate = extractDate(e.tenta_namn);

    return (
      e.kurskod === exam.kurskod &&
      facitDate === examDate &&
      e.tenta_namn !== exam.tenta_namn &&
      isFacit(e.tenta_namn)
    );
  });

  return facit || null;
};

export const filterExamsByDate = (selectedExam: Exam, exams: Exam[]) => {
  const normalizeName = (name: string) =>
    name.replace(".pdf", "").toLowerCase();

  const extractDate = (name: string) => {
    const normalized = normalizeName(name);
    const match = normalized.match(/(\d{4}[-_]\d{2}[-_]\d{2}|\d{8}|\d{6})/);
    if (!match) return null;

    const dateStr = match[0];
    let year, month, day;

    if (dateStr.includes("-") || dateStr.includes("_")) {
      [year, month, day] = dateStr.split(/[-_]/);
    } else if (dateStr.length === 8) {
      year = dateStr.substring(0, 4);
      month = dateStr.substring(4, 6);
      day = dateStr.substring(6, 8);
    } else if (dateStr.length === 6) {
      year = `20${dateStr.substring(0, 2)}`;
      month = dateStr.substring(2, 4);
      day = dateStr.substring(4, 6);
    } else {
      return null;
    }

    if (
      parseInt(month, 10) < 1 ||
      parseInt(month, 10) > 12 ||
      parseInt(day, 10) < 1 ||
      parseInt(day, 10) > 31
    ) {
      return null;
    }

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  };

  const selectedExamDate = extractDate(selectedExam.tenta_namn);
  if (!selectedExamDate) return [];

  return exams.filter((exam) => {
    const examDate = extractDate(exam.tenta_namn);
    return examDate === selectedExamDate;
  });
};

export const fetcher = async (key: string) => {
  const [type, param] = key.split(":");
  if (type === "exam") return fetchExamData(param);
  if (type === "pdf") return fetchPdfData(parseInt(param));
};

export const retryFetch = async (
  fetchFn: () => Promise<any>,
  retries = 3,
  delay = 1000,
) => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await fetchFn();
      if (result) return result;
    } catch (error) {
      console.error(`Fetch attempt ${i + 1} failed:`, error);
    }
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  throw new Error("Max retries reached");
};

import { pdfjs } from "react-pdf";

export async function convertPDFToImages(pdfUrl: string): Promise<string[]> {
  try {
    const loadingTask = pdfjs.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    const images: string[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not get canvas context");

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      const imageData = canvas.toDataURL("image/jpeg", 0.95);
      images.push(imageData);
    }

    return images;
  } catch (error) {
    console.error("Error converting PDF to images:", error);
    throw error;
  }
}

export function base64ToBlob(base64: string): Blob {
  const parts = base64.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}
