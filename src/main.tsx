import React from "react"
import ReactDOM from "react-dom/client"
import { NextUIProvider } from "@nextui-org/react"
import App from "./App.tsx"
import "./index.css"
import "@fontsource-variable/anuphan"
import { Toaster } from "sonner"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <NextUIProvider>
      <main className="dark px-4 text-foreground bg-background min-h-screen items-center justify-center flex">
        <App />
        <Toaster theme="dark" duration={3000} position="top-center" />
      </main>
    </NextUIProvider>
  </React.StrictMode>
)
