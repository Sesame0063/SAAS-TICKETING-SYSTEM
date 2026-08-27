const comments = [
  {
    author:"Support Agent",
    text:"We are investigating this issue now.",
    time:"10:25 AM",
  },
  {
    author:"Customer",
    text:"Thank you. Please update me when resolved.",
    time:"10:40 AM",
  },
];

export default function CommentsPanel() {
  return (
    <div className="space-y-5">
      {comments.map((comment)=>(
        <div key={comment.time} className="rounded-2xl bg-slate-50 p-4">
          <div className="flex justify-between">
            <p className="font-semibold text-blue-700">{comment.author}</p>
            <p className="text-xs text-slate-400">{comment.time}</p>
          </div>

          <p className="mt-2 text-slate-700">{comment.text}</p>
        </div>
      ))}

      <textarea
        rows={4}
        placeholder="Write a comment..."
        className="w-full rounded-xl border p-4"
      />

      <button className="rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700">
        Send Comment
      </button>
    </div>
  );
}
