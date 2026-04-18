import { BrowserRouter, Route, Routes } from "react-router";
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { ThemeProvider } from "./components/common/ThemeProvider";
import { Toaster } from "sonner";

export default function App() {
  return (
    <ThemeProvider>
      <Toaster richColors />

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
    </ThemeProvider>
  )
}
