import "./index.css";

import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Provider from "@/components/Provider.tsx";
import { StrictMode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";
import routes from "@/routes.tsx";

const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <RouterProvider router={router} />
      <Toaster />
    </Provider>
  </StrictMode>
);
