import { type ConfigStoreType } from "@/types/store.type";
import { create } from "zustand";


export const useConfigStore = create<ConfigStoreType>((set) => ({
    searchConfig: [],
    mode: "rag",
    loading: false,
    model: "qwen3.5",

    setMode: (mode) => set({ mode }),

    setSearchConfig: (config) => set({ searchConfig: config }),

    setLoading: (loading) => set({ loading }),

    setModel: (model) => set({model}),
    
}));