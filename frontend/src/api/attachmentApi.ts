import api from "./axios";

export interface Attachment {
  id: string;
  ticket_id: string;
  file_name: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export async function getAttachments(ticketId: string): Promise<Attachment[]> {
  const { data } = await api.get(`/tickets/${ticketId}/attachments`);
  return data;
}

export async function uploadAttachment(
  ticketId: string,
  file: File
): Promise<Attachment> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post(
    `/tickets/${ticketId}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
}

export async function deleteAttachment(id: string): Promise<void> {
  await api.delete(`/attachments/${id}`);
}

export function downloadAttachment(id: string) {
  window.open(
    `http://127.0.0.1:8000/attachments/${id}/download`,
    "_blank"
  );
}
