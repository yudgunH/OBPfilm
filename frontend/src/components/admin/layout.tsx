import type React from "react"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { BarChart, Film, MessageSquare, Users, DollarSign, Settings } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <Sidebar>
                <SidebarHeader>
                    <h2 className="px-4 text-lg font-semibold">Admin Dashboard</h2>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/admin">
                                    <BarChart className="mr-2 h-4 w-4" />
                                    Dashboard
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/admin/movies">
                                    <Film className="mr-2 h-4 w-4" />
                                    Movies
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/admin/comments">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Comments
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/admin/users">
                                    <Users className="mr-2 h-4 w-4" />
                                    Users
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/admin/ads">
                                    <DollarSign className="mr-2 h-4 w-4" />
                                    Ads
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href="/admin/settings">
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
            </Sidebar>
            <main className="flex-1 overflow-y-auto p-4">
                <SidebarTrigger className="mb-4 md:hidden" />
                {children}
            </main>
        </div>
    )
}

