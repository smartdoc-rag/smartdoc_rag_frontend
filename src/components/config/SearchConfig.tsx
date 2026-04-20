
import { Checkbox } from "../ui/checkbox";
import { SidebarMenuItem } from "../ui/sidebar";

export default function SearchConfig() {
    return (
        <SidebarMenuItem className="ml-3 mb-2">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox id="hybrid" className="p-2.5 cursor-pointer" />
                        <label
                            htmlFor="hybrid"
                            className="text-[16px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            Hybrid Search
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Checkbox id="rerank" className=" p-2.5 cursor-pointer" />
                        <label
                            htmlFor="rerank"
                            className="text-[16px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            Enable Re-rank
                        </label>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Checkbox id="self-rag" className="p-2.5 cursor-pointer" />
                        <label
                            htmlFor="self-rag"
                            className="text-[16px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                            Enable Self-RAG
                        </label>
                    </div>
                </div>
            </div>
        </SidebarMenuItem>
    );
}