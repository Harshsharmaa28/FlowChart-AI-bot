"use client"
import Diagram from "../Diagram";
import { useState, useRef } from 'react';
import { Canvg } from 'canvg';
import { ArrowUp } from "lucide-react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

export const PromptBar = () => {
    const [prompt, setPrompt] = useState('');
    const [mermaidCode, setMermaidCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [svgCode, setSvgCode] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const hostURL = process.env.NEXT_PUBLIC_HOST_URL
    console.log(hostURL)

    const handleSubmit = async () => {
        setLoading(true);
        try {
            setPrompt('')
            const res = await fetch(`${hostURL}/generate-code`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setMermaidCode(data.mermaidCode);
            setLoading(false);
        } catch (error) {
            toast.error("Server Error Please try again !")
        }
        finally{
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

    const downloadPng = async () => {
        const svgElement = document.querySelector('svg');
        if (!svgElement) {
            alert('Diagram not ready');
            return;
        }

        const clonedSvg = svgElement.cloneNode(true);

        const allElements = clonedSvg.querySelectorAll('*');
        const svgStyles = getComputedStyle(svgElement);

        clonedSvg.setAttribute('width', svgStyles.width);
        clonedSvg.setAttribute('height', svgStyles.height);

        allElements.forEach(el => {
            const style = getComputedStyle(el);
            el.setAttribute('style', `
          fill: ${style.fill};
          stroke: ${style.stroke};
          stroke-width: ${style.strokeWidth};
          font-family: ${style.fontFamily};
          font-size: ${style.fontSize};
        `);
        });

        const svgString = new XMLSerializer().serializeToString(clonedSvg);

        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        const v = await Canvg.from(ctx, svgString);
        await v.render();

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = 'diagram.png';
        a.click();
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Flowchart Generator</h1>
            {mermaidCode ? (
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">Mermaid Diagram:</h2>
                    <Diagram code={mermaidCode} onSvgGenerated={setSvgCode} />
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={downloadSvg}
                            className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:cursor-pointer"
                        >
                            Download SVG
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="mt-2 px-4 py-2 bg-gray-800 text-white rounded hover:cursor-pointer"
                        >
                            View Fullscreen
                        </button>
                    </div>
                    
                    {showModal && (
                        <div className="fixed flex-col gap-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        {/* <button
                            onClick={() => setShowModal(false)}
                            className=" bg-red-600 text-white px-3 py-1 rounded"
                            >
                            Close
                        </button> */}
                        <div className="bg-white p-4 overflow-auto relative">
                            <X 
                            onClick={() => setShowModal(false)}
                            className="hover:cursor-pointer"/>
                            <div className="w-[90vw] " dangerouslySetInnerHTML={{ __html: svgCode }} />
                        </div>
                        </div>
                    )}
                </div>
            ):
            <div className="flex justify-center items-center w-[720px] h-[500px]">
                Your Flow chart Will Appear Here
            </div>
        }
            <div className="">
                <textarea
                className="w-full p-4 border border-gray-300 shadow-xl rounded-2xl focus:outline-none"
                rows={2}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your flowchart..."
                />
                <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 absolute -ml-20 bg-black rounded-full p-4 text-white"
                    disabled={loading}
                >
                    {loading ? 'Generating...' : <ArrowUp/>}
                </button>
            </div>
        </div>
    );
}
