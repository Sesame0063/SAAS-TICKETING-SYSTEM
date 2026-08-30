import api from "./axios";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

export async function downloadCsvReport() {
  const res = await api.get("/reports/export/csv", {
    responseType: "blob",
  });

  download(res.data, "dashboard-report.csv");
}

export async function downloadPdfReport() {
  const res = await api.get("/reports/export/pdf", {
    responseType: "blob",
  });

  download(res.data, "dashboard-report.pdf");
}



