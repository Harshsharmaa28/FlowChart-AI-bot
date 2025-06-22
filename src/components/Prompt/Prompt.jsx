"use client"
import Diagram from "../Diagram";
import { useState, useRef } from 'react';
import { Canvg } from 'canvg';
import { ArrowUp } from "lucide-react";
import { X } from "lucide-react";
import { Download } from 'lucide-react';
import { Expand } from 'lucide-react';
import { toast } from "react-toastify";
import { Loader } from 'lucide-react';

export const PromptBar = () => {
    const [prompt, setPrompt] = useState('');
    const [mermaidCode, setMermaidCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [svgCode, setSvgCode] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [prevPrompt,setprevPrompt] = useState('');

    const hostURL = process.env.NEXT_PUBLIC_HOST_URL
    console.log(hostURL)

    const handleSubmit = async () => {
        if(!prompt) return toast.warning("Please Enter Prompt First !");
        setLoading(true);
        try {
            setprevPrompt(prompt)
            setPrompt('')
            const res = await fetch(`${hostURL}/generate-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if(res.ok){
                const data = await res.json();
                setMermaidCode(data.mermaidCode);
                setLoading(false);
            }
            else toast.error("Server Error Please try again")
        } catch (error) {
            toast.error("Server Error Please try again !")
        }
        finally {
            setLoading(false)
        }
    };

    const downloadSvg = () => {
        if (!svgCode) return alert("SVG not ready");
        const blob = new Blob([svgCode], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.svg';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 h-screen flex flex-col justify-between">
            <div className="flex-1 flex flex-col">
                <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">Flowchart Generator</h1>
                {mermaidCode ? (
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-2">Prompt: <span className="italic">{prevPrompt}</span></h2>

                        <div className="bg-white overflow-scroll max-h-[450px] dark:bg-gray-800 shadow-md p-4 rounded-xl border dark:border-gray-700">
                            <Diagram code={mermaidCode} onSvgGenerated={setSvgCode} />
                            <div className="flex gap-4 mt-4 text-gray-600 dark:text-gray-300">
                                <Download onClick={downloadSvg} className="cursor-pointer hover:text-black dark:hover:text-white" />
                                <Expand onClick={() => setShowModal(true)} className="cursor-pointer hover:text-black dark:hover:text-white" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-[450px] text-gray-400 text-lg border border-dashed border-gray-300 rounded-xl bg-gray-50 dark:bg-gray-900 dark:border-gray-700">
                        Your flowchart will appear here
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                        <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-[95vw] max-h-[90vh] overflow-auto">
                            <X onClick={() => setShowModal(false)} className="absolute top-4 right-4 cursor-pointer text-gray-500 dark:text-gray-300 hover:text-red-500" />
                            <div className="max-w-[95vw]" dangerouslySetInnerHTML={{ __html: svgCode }} />
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-6 relative">
                <textarea
                    className="w-full resize-none p-4 pr-20 rounded-2xl shadow-inner border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    rows={2}
                    placeholder="Describe your flowchart..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="absolute bottom-[25px] right-4 bg-black hover:cursor-pointer hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow transition"
                >
                    {loading ? <Loader/> : <ArrowUp />}
                </button>
            </div>
        </div>

    );
}
