import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router";

const AuthLayout = () => {
	const { accessToken, refresh } = useAuthStore();
	const navigate = useNavigate();
	const [checking, setChecking] = useState(true);

	const ranRef = useRef(false);

	useEffect(() => {
		if (ranRef.current) return;
		ranRef.current = true;

		const init = async () => {
			try {
				if (accessToken) {
					navigate("/", { replace: true });
					return;
				}

				const success = await refresh();
				if (success) {
					navigate("/", { replace: true });
					return;
				}

				setChecking(false);
			} catch (error) {
				console.error(error);
				setChecking(false);
			}
		};

		init();
	}, []);

	if (checking) {
		return (
			<div className="flex h-screen items-center justify-center">
				Đang kiểm tra đăng nhập...
			</div>
		);
	}

	return <Outlet />;
};

export default AuthLayout;
