import { BrowserRouter, Route, Routes } from "react-router";
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={<UserRoutes />}
          />

          <Route
            path="/auth/*"
            element={<AuthRoutes />}
          />

        </Routes>
      </BrowserRouter>
    </>
  )
}
