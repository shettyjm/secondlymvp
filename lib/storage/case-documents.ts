export const CASE_DOCUMENTS_BUCKET = "case-documents";

export function buildCaseDocumentPath({
  userId,
  caseId,
  fileName,
  timestamp = Date.now(),
}: {
  userId: string;
  caseId: string;
  fileName: string;
  timestamp?: number;
}) {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  return `${userId}/${caseId}/${timestamp}-${safeName}`;
}
