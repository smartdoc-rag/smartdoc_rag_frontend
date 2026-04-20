import { useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { NavUser } from "./SidebarUser"
import { SquarePen } from "lucide-react"
import { ModeToggle } from "./ModeToggle"
import { useLocation, useNavigate } from "react-router"
import { Button } from "../ui/button"
import { useAuthStore } from "@/stores/useAuthStore"
import ConversationList from "../conversation/ConversationList"
import SearchConfig from "../config/SearchConfig"
import SidebarSection from "./SidebarSection"



export function AppSidebar() {
    const [active, setActive] = useState("")
    const location = useLocation()
    const navigate = useNavigate()
    const { user, signOut } = useAuthStore()

    const pathname = location.pathname

    const handleSignOut = async () => {
        await signOut()
        navigate("/auth/sign-in")
    }
    return (
        <Sidebar>
            {/* HEADER */}
            <SidebarHeader className="relative p-3">
                <div className="absolute top-2 right-2">
                    <ModeToggle />
                </div>

                <div className="flex flex-col mb-5 gap-1 group-data-[collapsible=icon]:hidden">
                    <span className="text-lg font-semibold">SmartDoc AI</span>
                </div>

                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            className="cursor-pointer py-2"
                            isActive={pathname === "/"}
                            onClick={() => {
                                navigate("/")
                                setActive("")
                            }
                            }
                        >
                            <SquarePen />
                            <span className="text-[15px]">Đoạn chat mới</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>

                {/* Instructions */}
                <SidebarSection
                    title="Instruction"
                >
                    <span>Instruction 12341</span>
                </SidebarSection>

                {/* Settings */}
                <SidebarSection
                    title="Settings"
                >
                    <SearchConfig />
                </SidebarSection>

                {/* History */}

                <SidebarSection
                    title="Lịch sử"
                >
                    <ConversationList
                        active={active}
                        setActive={setActive}
                    />
                </SidebarSection>
            </SidebarContent>

            <SidebarFooter className="p-4 text-xs text-muted-foreground">
                {
                    user
                        ?
                        (<NavUser user={user} onSignOut={handleSignOut} />)
                        :
                        (
                            <Button
                                onClick={() => navigate('/auth/sign-in')}
                            >
                                Đăng nhập
                            </Button>
                        )
                }
            </SidebarFooter>
        </Sidebar>
    )
}