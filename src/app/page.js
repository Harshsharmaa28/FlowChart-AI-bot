
"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e4ecf2] to-[#d1e3f8] text-gray-800 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full bg-blue-300 opacity-30 float-animate-${(i % 5) + 1}`}
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-6 text-center drop-shadow-lg">
          AI-Powered Flowchart Generator
        </h1>
        <p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl mb-8">
          Turn your ideas into beautiful, shareable flowcharts using natural language and Mermaid.js.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 hover:cursor-pointer hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
