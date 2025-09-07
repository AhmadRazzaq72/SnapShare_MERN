import Navbar from "./components/Navbar";
import UploadBox from "./components/UploadBox";
import ShareLink from "./components/ShareLink";
import Footer from "./components/Footer";
import { useState } from "react";

function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [link, setLink] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col items-center justify-center px-6">
        <UploadBox />
        {link && <ShareLink url={link} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
