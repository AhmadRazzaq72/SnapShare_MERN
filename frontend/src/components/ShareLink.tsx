import { Link as LinkIcon, Copy } from "lucide-react";

export default function ShareLink({ url }: { url: string }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    alert("Copied to clipboard!");
  };

  return (
    <div className="mt-6 flex items-center justify-between px-4 py-3 bg-slate-800 text-white rounded-xl border border-slate-700">
      <div className="flex items-center gap-2">
        <LinkIcon className="text-blue-400" />
        <span>{url}</span>
      </div>
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm transition"
      >
        <Copy size={16} /> Copy
      </button>
    </div>
  );
}

