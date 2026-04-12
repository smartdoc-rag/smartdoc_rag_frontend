import { Route, Routes } from "react-router";
import UserLayout from "../layouts/UserLayout";
import HomePage from "../pages/HomePage";
import ChatPage from "../pages/ChatPage";

export default function UserRoutes() {
    return (
        <Routes>
            <Route element={<UserLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/c/:id" element={<ChatPage />} />
            </Route>
        </Routes>
    )
}
