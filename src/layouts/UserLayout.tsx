import { Outlet } from "react-router";
import { Header } from "@/components/common/Header";


export default function UserLayout() {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container max-w-screen-2xl py-6">
                <Outlet />
            </main>
        </div>
    )
}
