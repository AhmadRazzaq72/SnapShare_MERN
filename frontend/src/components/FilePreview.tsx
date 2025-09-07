import { File, X } from "lucide-react";

interface FilePreviewProps {
  file: File | null;
  onRemove: () => void;
}

export default function FilePreview({ file, onRemove }: FilePreviewProps) {
  if (!file) return null;

  return (
    <div className="mt-4 flex items-center justify-between px-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white">
      <div className="flex items-center gap-3">
        <File size={22} className="text-blue-400" />
        <div>
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-gray-400">
            {(file.size / 1024).toFixed(1)} KB
          </p>
        </div>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded-full hover:bg-slate-700 transition"
      >
        <X size={18} className="text-red-400" />
      </button>
    </div>
  );
}
