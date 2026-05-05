import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { useEffect, useRef, useState } from "react";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface PDFViewerProps {
    fileUrl?: string;
    page: number;
    chunk?: string;
    showExcerpt?: boolean;
}

export default function PDFViewer({ fileUrl, page, chunk, showExcerpt = true }: PDFViewerProps) {
    const viewerRef = useRef<HTMLDivElement | null>(null);
    const [renderCount, setRenderCount] = useState(0);

    useEffect(() => {
        if (!chunk || !viewerRef.current) return;

        const applyHighlights = () => {
            const spans = Array.from(viewerRef.current?.querySelectorAll<HTMLSpanElement>(".textLayer span") ?? []);
            spans.forEach((span) => span.classList.remove("highlight"));

            const chunkLower = chunk.toLowerCase().trim();

            // Extract key phrases from chunk (split by sentence or line)
            const phrases = chunkLower
                .split(/[\n.!?]+/)
                .map((p) => p.trim())
                .filter((p) => p.length > 15)
                .slice(0, 2);

            if (!phrases.length) {
                // If no long phrase, use first 8-10 words
                const words = chunkLower.split(/\s+/).slice(0, 8).join(" ");
                if (words.length > 10) phrases.push(words);
            }

            // Highlight spans that contain key phrases
            const highlightedIndexes = new Set<number>();
            spans.forEach((span, idx) => {
                const spanText = span.textContent?.toLowerCase() ?? "";
                if (phrases.some((phrase) => spanText.includes(phrase) || phrase.includes(spanText))) {
                    highlightedIndexes.add(idx);
                }
            });

            // Also highlight consecutive spans around matches for context
            highlightedIndexes.forEach((idx) => {
                if (idx > 0) highlightedIndexes.add(idx - 1);
                if (idx < spans.length - 1) highlightedIndexes.add(idx + 1);
            });

            highlightedIndexes.forEach((idx) => {
                spans[idx]?.classList.add("highlight");
            });
        };

        const timeout = window.setTimeout(applyHighlights, 150);
        return () => window.clearTimeout(timeout);
    }, [chunk, page, renderCount]);

    if (!fileUrl) {
        return (
            <div className="rounded-xl border border-muted bg-muted/5 p-4 text-sm text-muted-foreground">
                Kh�ng c� t?p PDF d? hi?n th?.
            </div>
        );
    }

    return (
        <div ref={viewerRef} className="space-y-4" style={{ "--highlight-bg-color": "rgba(255,229,100,0.8)" } as React.CSSProperties}>
            <div className="rounded-xl border border-muted bg-background p-2 overflow-hidden">
                <Document
                    file={fileUrl}
                    loading={
                        <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
                            �ang t?i PDF�
                        </div>
                    }
                    error={
                        <div className="flex min-h-80 items-center justify-center text-sm text-destructive">
                            Kh�ng th? t?i PDF.
                        </div>
                    }
                >
                    <Page pageNumber={page} width={860} onRenderSuccess={() => setRenderCount((count) => count + 1)} />
                </Document>
            </div>

            {showExcerpt && chunk && (
                <div className="rounded-3xl border border-yellow-300/40 bg-yellow-50 p-5 text-sm text-foreground shadow-sm">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-yellow-700">
                        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500" />
                        �o?n tr�ch d� d�ng (highlight)
                    </div>
                    <p className="whitespace-pre-wrap leading-relaxed text-neutral-900">{chunk}</p>
                </div>
            )}
        </div>
    );
}

