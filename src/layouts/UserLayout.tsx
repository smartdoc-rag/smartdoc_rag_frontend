import { AppSidebar } from "@/components/common/AppSideBar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useRef, useState } from "react";

import { Outlet, useNavigate } from "react-router";

export default function UserLayout() {
	const { accessToken, user, loading, refresh, getUser } = useAuthStore();
	const [starting, setStarting] = useState(true);
	const ranRef = useRef(false);
	const navigate = useNavigate();

	const init = async () => {
		try {
			if (!accessToken) {
				const success = await refresh();
				if (!success) {
					navigate("/auth/sign-in");
				}
			}

			if (accessToken && !user) {
				await getUser();
			}
		} catch (error) {
			console.error(error);
		} finally {
			setStarting(false);
		}
	};

	useEffect(() => {
		if (ranRef.current) return;
		ranRef.current = true;
		init();
	});

	if (starting || loading) {
		return null
	}

	return (
		<SidebarProvider>
			<div className="flex h-screen w-full">
				<AppSidebar />

				<div className="flex flex-col flex-1 overflow-hidden relative">
					<SidebarTrigger className="absolute top-2 left-2 z-10" size="lg" />

					<div className="flex-1 min-h-0">
						<Outlet />
					</div>
				</div>
			</div>
		</SidebarProvider>
	);
}
