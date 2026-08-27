import { useEffect, useState } from "react";
import type { Attachment } from "../api/attachmentApi";
import { getAttachments, uploadAttachment, deleteAttachment } from "../api/attachmentApi";

export default function useAttachments(ticketId: string) {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAttachments() {
    try {
      const data = await getAttachments(ticketId);
      setAttachments(data);
    } finally {
      setLoading(false);
    }
  }

  async function upload(file: File) {
    await uploadAttachment(ticketId, file);
    await loadAttachments();
  }

  async function remove(id: string) {
    await deleteAttachment(id);
    await loadAttachments();
  }

  useEffect(() => {
    loadAttachments();
  }, [ticketId]);

  return {
    attachments,
    loading,
    upload,
    remove,
    refresh: loadAttachments,
  };
}

