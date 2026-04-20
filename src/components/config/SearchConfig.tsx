
import { useConfigStore } from "@/stores/useConfigStore";
import { Checkbox } from "../ui/checkbox";
import { SidebarMenuItem } from "../ui/sidebar";

export default function SearchConfig() {

    const { searchConfig, setSearchConfig } = useConfigStore()

    const handleChange = (value: string) => {
        const exist = searchConfig.includes(value)

        if (exist) {
            setSearchConfig(searchConfig.filter(item => item !== value))
        }
        else {
            setSearchConfig([...searchConfig, value])
        }


    }

    return (
        <SidebarMenuItem className="ml-3 mb-2">
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="hybrid"
                            className="p-2.5 cursor-pointer"
                            checked={searchConfig.includes('hybrid')}
                            onClick={() => handleChange('hybrid')}
                        />
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
                        <Checkbox
                            id="rerank"
                            className=" p-2.5 cursor-pointer"
                            checked={searchConfig.includes('rerank')}
                            onClick={() => handleChange('rerank')}
                        />
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
                        <Checkbox
                            id="self-rag"
                            className="p-2.5 cursor-pointer"
                            checked={searchConfig.includes('self-rag')}
                            onClick={() => handleChange('self-rag')}
                        />
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