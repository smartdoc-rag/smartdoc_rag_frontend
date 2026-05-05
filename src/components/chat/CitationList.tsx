import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { GraphCitation, RagCitation } from "@/types/chat.type";
import { FileText, ExternalLink, Database, Eye } from "lucide-react";
import { useState } from "react";
import PDFViewer from "./PDFViewer";

type GroupedCitation = {
    pages: number[];
    chunks: string[];
    indices: number[];
    markers: string[];
    startLines: number[];
    endLines: number[];
    fileUrls: string[];
};

function isRagCitation(citation: RagCitation | GraphCitation): citation is RagCitation {
    return (citation as RagCitation).file_name !== undefined;
}

export default function CitationList({ citations }: { citations: RagCitation[] | GraphCitation[] }) {
    const [expandedChunks, setExpandedChunks] = useState<Record<string, boolean>>({});
    const [openPdfDialog, setOpenPdfDialog] = useState(false);
    const [selectedCitation, setSelectedCitation] = useState<RagCitation | null>(null);

    const handleOpenCitation = (citation: RagCitation) => {
        setSelectedCitation(citation);
        setOpenPdfDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenPdfDialog(false);
        setSelectedCitation(null);
    };

    const handleDialogOpenChange = (open: boolean) => {
        if (!open) {
            handleCloseDialog();
            return;
        }
        setOpenPdfDialog(open);
    };

    if (!citations?.length) return null;

    if (citations.length > 0 && !isRagCitation(citations[0])) {
        const graphCitations = citations as GraphCitation[];
        return (
            <div className="flex flex-wrap gap-2 mt-2">
                {graphCitations.map((citation, idx) => (
                    <Popover key={idx}>
                        <PopoverTrigger asChild>
                            <button className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-muted hover:bg-muted/80 text-foreground rounded-full transition-all duration-200">
                                <Database className="w-3 h-3" />
                                <span>{citation.marker || `[${idx + 1}]`}</span>
                                <span className="text-muted-foreground">Graph</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-3">
                            <div className="space-y-2">
                                <div className="text-xs font-medium">
                                    {citation.graph_entity_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Loại: {citation.graph_entity_type}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Marker: {citation.marker}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                ))}
            </div>
        );
    }

    const ragCitations = citations as RagCitation[];

    const grouped = ragCitations.reduce<Record<string, GroupedCitation>>((acc, c, index) => {
        const fileName = c.file_name ?? "unknown";
        if (!acc[fileName]) {
            acc[fileName] = {
                pages: [],
                chunks: [],
                indices: [],
                markers: [],
                startLines: [],
                endLines: [],
                fileUrls: [],
            };
        }
        acc[fileName].pages.push(c.page + 1);
        acc[fileName].chunks.push(c.chunk ?? "");
        acc[fileName].indices.push(index + 1);
        acc[fileName].markers.push(c.marker ?? "");
        acc[fileName].startLines.push(c.start_line ?? 0);
        acc[fileName].endLines.push(c.end_line ?? 0);
        acc[fileName].fileUrls.push(c.file_url ?? "");
        return acc;
    }, {});

    const toggleChunk = (key: string) => {
        setExpandedChunks(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleViewFile = (fileUrl: string) => {
        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    };

    return (
        <>
            <div className="flex flex-wrap gap-2 mt-2">
                {Object.entries(grouped).map(([fileName, group]) => {
                    const { pages, chunks, indices, markers, startLines, endLines, fileUrls } = group;
                    const fileUrl = fileUrls[0];

                    return (
                        <Popover key={fileName}>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-muted hover:bg-muted/80 text-foreground rounded-full transition-all duration-200"
                                >
                                    <FileText className="w-3 h-3" />
                                    <span className="max-w-37.5 truncate">{fileName}</span>
                                    <span className="text-muted-foreground">({pages.length})</span>
                                </button>
                            </PopoverTrigger>

                            <PopoverContent className="w-96 p-3 max-h-96 overflow-y-auto custom-scrollbar">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between border-b pb-2">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <FileText className="w-4 h-4 text-primary shrink-0" />
                                            <span className="text-sm font-medium truncate">{fileName}</span>
                                        </div>
                                        {fileUrl && (
                                            <button
                                                type="button"
                                                onClick={() => handleViewFile(fileUrl)}
                                                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
                                            >
                                                <span>Xem file</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        {pages.map((page: number, idx: number) => {
                                            const chunkKey = `${fileName}-${page}-${idx}`;
                                            const isExpanded = expandedChunks[chunkKey];
                                            const chunkText = chunks[idx];
                                            const needTruncate = chunkText?.length > 120;
                                            const displayText = needTruncate && !isExpanded && chunkText
                                                ? `${chunkText.slice(0, 150)}...`
                                                : chunkText || "Không có nội dung";
                                            const citation = ragCitations[indices[idx] - 1];

                                            return (
                                                <div key={chunkKey} className="space-y-1.5">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded">Trang {page}</span>
                                                        <span className="text-xs text-muted-foreground">{markers[idx] || `[${indices[idx]}]`}</span>
                                                        {startLines[idx] && endLines[idx] && (
                                                            <span className="text-xs text-muted-foreground">(dòng {startLines[idx]}-{endLines[idx]})</span>
                                                        )}
                                                    </div>

                                                    <div className="rounded-xl border border-primary/10 bg-primary/5 p-3 text-xs leading-relaxed text-foreground">
                                                        {displayText}
                                                        {needTruncate && (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleChunk(chunkKey)}
                                                                className="text-primary hover:underline ml-1"
                                                            >
                                                                {isExpanded ? "thu gọn" : "xem thêm"}
                                                            </button>
                                                        )}
                                                    </div>

                                                    {fileUrl && citation && (
                                                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleOpenCitation(citation)}
                                                                className="inline-flex items-center gap-1 text-primary hover:text-primary/80"
                                                            >
                                                                <Eye className="w-3 h-3" />
                                                                Xem trang
                                                            </button>
                                                        </div>
                                                    )}

                                                    {idx < pages.length - 1 && (
                                                        <div className="border-t border-muted my-2" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    );
                })}
            </div>

            <Dialog open={openPdfDialog} onOpenChange={handleDialogOpenChange}>
                <DialogContent
                    className="w-full min-h-[95vh] max-w-[95vw] max-h-[95vh] overflow-hidden p-0"
                    style={{
                        maxWidth: '95vw',
                        width: '95vw',
                        height: '95vh',
                        maxHeight: '95vh'
                    }}
                >
                    <div className="flex flex-col h-full overflow-hidden">
                        <DialogHeader className="px-6 pt-6 pb-2 shrink-0">
                            <DialogTitle>{selectedCitation?.file_name ?? "Tài liệu gốc"}</DialogTitle>
                            <DialogDescription>
                                Trang {selectedCitation?.page ? selectedCitation?.page + 1 : 1} · {selectedCitation?.marker ? `Marker: ${selectedCitation.marker}` : "Không có marker"}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex-1 overflow-y-auto min-h-0">
                            <div className="grid gap-6 px-6 pb-6 lg:grid-cols-[2fr_1fr]">
                                <div className="overflow-auto rounded-4xl border border-muted/50 bg-background shadow-inner">
                                    <PDFViewer
                                        fileUrl={selectedCitation?.file_url}
                                        page={selectedCitation?.page ? selectedCitation?.page + 1 : 1}
                                        chunk={selectedCitation?.chunk}
                                        showExcerpt={false}
                                    />
                                </div>

                                <div className="overflow-y-auto rounded-4xl border border-muted/50 bg-muted/5 p-4 shadow-sm">
                                    <div className="sticky top-0 z-10 mb-4 rounded-2xl border border-muted/20 bg-muted/10 px-4 py-3 text-sm font-semibold text-muted-foreground">
                                        Thông tin trích dẫn
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="text-xs text-muted-foreground">Trang</div>
                                            <div className="font-medium">{selectedCitation?.page ? selectedCitation?.page + 1 : 1}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-muted-foreground">Marker</div>
                                            <div className="font-medium">{selectedCitation?.marker ?? "Không có marker"}</div>
                                        </div>
                                        {(selectedCitation?.start_line || selectedCitation?.end_line) && (
                                            <div>
                                                <div className="text-xs text-muted-foreground">Vị trí</div>
                                                <div className="font-medium">Dòng {selectedCitation?.start_line ?? "-"}-{selectedCitation?.end_line ?? "-"}</div>
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-xs text-muted-foreground">Đoạn trích</div>
                                            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-3 text-sm leading-relaxed text-foreground whitespace-pre-wrap wrap-break-words">
                                                {selectedCitation?.chunk || "Không có đoạn trích để hiển thị."}
                                            </div>
                                        </div>
                                        {selectedCitation?.file_url && (
                                            <div>
                                                <div className="text-xs text-muted-foreground">Link gốc</div>
                                                <button
                                                    type="button"
                                                    onClick={() => window.open(selectedCitation.file_url, "_blank")}
                                                    className="text-primary underline"
                                                >
                                                    Mở PDF gốc
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="flex flex-wrap items-center justify-between gap-2 px-6 pb-6 shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={() => selectedCitation?.file_url && window.open(selectedCitation.file_url, "_blank")}
                            >
                                <ExternalLink className="w-4 h-4" />
                                Mở file trong tab mới
                            </Button>
                            <Button variant="default" size="sm" type="button" onClick={handleCloseDialog}>
                                Đóng
                            </Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
