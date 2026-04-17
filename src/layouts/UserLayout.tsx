import { AppSidebar } from "@/components/common/AppSideBar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { Outlet } from "react-router"



export default function UserLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div>
                <SidebarTrigger className="absolute z-10" size="lg" />
            </div>
            <div className="flex h-screen w-full items-center justify-center">
                <Outlet />
            </div>
        </SidebarProvider>
    )
}
