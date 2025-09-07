import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import FilePreview from "./FilePreview";

export default function UploadBox() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 rounded-2xl bg-slate-900/70 backdrop-blur-lg shadow-2xl border border-slate-700">
      <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
        <Upload className="text-blue-400" /> Share Something
      </h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write or paste text here..."
        className="w-full h-40 p-4 rounded-xl bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl cursor-pointer transition">
          <FileText size={18} /> Upload File
          <input type="file" className="hidden" onChange={handleFileChange} />
        </label>
        <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-medium transition">
          Generate Link
        </button>
      </div>

      <FilePreview file={file} onRemove={() => setFile(null)} />
    </div>
  );
}
