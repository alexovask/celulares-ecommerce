import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";

import { useEffect } from "react";
import { supabase } from "./supabase/client";

export default function App() {
  useEffect(() => {
    (async () => {
      const { data, error, status } = await supabase
        .from("user_roles") // <- pon una tabla real
        .select("*")
        .limit(3);

      console.log("status:", status);
      console.log("error:", error);
      console.log("data:", data);
    })();
  }, []);

  return <div>OK</div>;
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  </StrictMode>,
);
