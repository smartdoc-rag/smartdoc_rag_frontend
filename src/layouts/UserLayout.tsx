import { AppSidebar } from "@/components/common/AppSideBar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

import { Outlet } from "react-router"



export default function UserLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main>
                <SidebarTrigger />
                <Outlet />
            </main>
        </SidebarProvider>
    )
}
