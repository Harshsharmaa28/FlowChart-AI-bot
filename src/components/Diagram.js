'use client';

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export default function Diagram({ code, onSvgGenerated }) {
  const [svgCode, setSvgCode] = useState('');

  useEffect(() => {
    if (!code) return;

    mermaid.initialize({ startOnLoad: false });

    const renderMermaid = async () => {
      try {
        const { svg } = await mermaid.render('generatedDiagram', code);
        setSvgCode(svg);
        if (onSvgGenerated) onSvgGenerated(svg); 
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    };

    renderMermaid();
  }, [code]);

  return (
    <div>
      <div className='border-black p-2' dangerouslySetInnerHTML={{ __html: svgCode }} />
    </div>
  );
}
