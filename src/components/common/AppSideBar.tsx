import { useState } from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { NavUser } from "./SidebarUser"
import { SquarePen } from "lucide-react"
import { ModeToggle } from "./ModeToggle"
import { useLocation, useNavigate } from "react-router"

const user = {
    name: 'phong',
    email: 'test123@gmail.com',
    avatar: 'C'
}

export function AppSidebar() {
    const [active, setActive] = useState("instructions-general")
    const location = useLocation()
    const navigate = useNavigate()

    const pathname = location.pathname

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
                            isActive={pathname === "/"}
                            onClick={() => navigate("/")}
                        >
                            <SquarePen />
                            <span>Đoạn chat mới</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>

                {/* Instructions */}
                <SidebarGroup>
                    <SidebarGroupLabel>Instructions</SidebarGroupLabel>

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "instructions-general"}
                                onClick={() => setActive("instructions-general")}
                            >
                                General Instructions
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "instructions-custom"}
                                onClick={() => setActive("instructions-custom")}
                            >
                                Custom Prompt
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "instructions-examples"}
                                onClick={() => setActive("instructions-examples")}
                            >
                                Examples
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Settings */}
                <SidebarGroup>
                    <SidebarGroupLabel> Settings</SidebarGroupLabel>

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "settings-temperature"}
                                onClick={() => setActive("settings-temperature")}
                            >
                                Temperature
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "settings-tokens"}
                                onClick={() => setActive("settings-tokens")}
                            >
                                Max Tokens
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "settings-top-p"}
                                onClick={() => setActive("settings-top-p")}
                            >
                                Top P
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* Model */}
                <SidebarGroup>
                    <SidebarGroupLabel>Model</SidebarGroupLabel>

                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "model-gpt4o"}
                                onClick={() => setActive("model-gpt4o")}
                            >
                                GPT-4o
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "model-claude"}
                                onClick={() => setActive("model-claude")}
                            >
                                Claude 3.5
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                            <SidebarMenuButton
                                isActive={active === "model-mixtral"}
                                onClick={() => setActive("model-mixtral")}
                            >
                                Mixtral
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {/* History */}
                <SidebarGroup>
                    <SidebarGroupLabel>Lịch sử</SidebarGroupLabel>
                    {[...Array(10)].map((_, i) => (
                        <SidebarMenuButton>
                            Lịch sử chat {i}
                        </SidebarMenuButton>
                    ))}
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 text-xs text-muted-foreground">
                <NavUser
                    user={user}
                />
            </SidebarFooter>
        </Sidebar>
    )
}