import { BrowserRouter, Route, Routes } from "react-router";
import UserRoutes from "./routes/UserRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import { ThemeProvider } from "./components/common/ThemeProvider";
import { Toaster } from "sonner";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


export default function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
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
      <ReactQueryDevtools initialIsOpen={false} />

    </QueryClientProvider>

  )
}
