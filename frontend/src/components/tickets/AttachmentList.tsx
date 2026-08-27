import { Upload, FileText, Trash2, Download } from "lucide-react";
import useAttachments from "../../hooks/useAttachments";
import { downloadAttachment } from "../../api/attachmentApi";

interface Props {
  ticketId: string;
}

export default function AttachmentList({ ticketId }: Props) {
  const { attachments, loading, upload, remove } =
    useAttachments(ticketId);

  async function handleUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    await upload(file);
    event.target.value = "";
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-md">
      <h2 className="mb-5 text-xl font-semibold">Attachments</h2>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 p-8 transition hover:border-blue-500">
        <Upload size={30} className="text-blue-600" />

        <p className="mt-3 text-slate-600">
          Click to upload an attachment
        </p>

        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
      </label>

      {loading ? (
        <p className="mt-5 text-slate-500">
          Loading attachments...
        </p>
      ) : attachments.length === 0 ? (
        <p className="mt-5 text-slate-500">
          No attachments uploaded yet.
        </p>
      ) : (
        <div className="mt-6 space-y-3">
          {attachments.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
            >
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" />

                <div>
                  <p className="font-medium">
                    {file.file_name}
                  </p>

                  <p className="text-xs text-slate-500">
                    {(file.file_size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadAttachment(file.id)}
                  className="rounded-lg bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
                >
                  <Download size={18} />
                </button>

                <button
                  onClick={() => remove(file.id)}
                  className="rounded-lg bg-red-100 p-2 text-red-700 hover:bg-red-200"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
