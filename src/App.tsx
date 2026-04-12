import { BrowserRouter, Route, Routes } from "react-router";
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { ThemeProvider } from "./components/common/ThemeProvider";

export default function App() {
  return (
    <ThemeProvider>
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
