import { useState } from "react"; // 1. Pievieno importu
import { Link } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { selectIsAuthenticated } from "../features/auth/slice/authSlice";

export default function Home() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  // 2. Definē stāvokli atvērtajai bildei
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="text-center space-y-6 py-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Manage your projects smarter
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Simple and powerful task tracking system for teams and individuals.
          Stay organized, collaborate easily, and get things done.
        </p>

        <div className="flex justify-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/projects"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Go to Projects
            </Link>
          ) : (
            <>
              <Link
                to="/register"
                className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 border border-gray-300 rounded-md hover:border-gray-500 transition"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6">
        {[
          {
            title: "Project Management",
            desc: "Create and manage projects with ease",
          },
          {
            title: "Team Collaboration",
            desc: "Invite members and work together",
          },
          {
            title: "Task Tracking",
            desc: "Track progress and stay organized",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 border rounded-lg bg-white shadow-lg hover:shadow-emerald-600 transition"
          >
            <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </section>

      {/* PREVIEW (UI block) ar klikšķa funkciju */}
      <section className="bg-white border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">
          Clean and intuitive interface
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {["Screenshot1.png", "Screenshot2.png", "Screenshot3.png"].map((img, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedImg(`/images/${img}`)} // Uzstāda bildi pie klikšķa
              className="relative overflow-hidden rounded-lg border border-gray-200 
             shadow-lg hover:shadow-emerald-500 cursor-pointer"
            >
              <img 
                src={`/images/${img}`} 
                alt="UI Preview" 
                className="w-full h-48 object-contain bg-gray-50 hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* USE CASES */}
      <section className="text-center space-y-6">
        <h2 className="text-2xl font-semibold">Built for everyone</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {["Developers", "Teams", "Startups", "Students"].map((item) => (
            <span
              key={item}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center space-y-4 py-10">
        <h2 className="text-2xl font-semibold">
          Start managing your projects today
        </h2>
        <Link
          to={isAuthenticated ? "/projects" : "/register"}
          className="inline-block px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
        >
          {isAuthenticated ? "Go to Projects" : "Create Account"}
        </Link>
      </section>

      {/* 3. MODAL LOGS (Parādās tikai kad bilde ir izvēlēta) */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 cursor-zoom-out"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <img 
              src={selectedImg} 
              alt="Full size" 
              className="max-w-full max-h-full object-contain rounded shadow-2xl"
            />
            <button 
              className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300"
              onClick={() => setSelectedImg(null)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}