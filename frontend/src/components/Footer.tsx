export default function Footer() {
  return (
    <footer className="px-6 py-4 bg-slate-950 border-t border-slate-800 text-center text-gray-400 text-sm">
      <p>
        © {new Date().getFullYear()} <span className="text-blue-400 font-medium">AirShareX</span> · All rights reserved.
      </p>
      <p className="mt-1 text-xs">
        Built with ❤️ using MERN + Vite
      </p>
    </footer>
  );
}
