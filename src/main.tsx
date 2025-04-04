import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

// Page imports
import Root from "./Root";
import Welcome from "./components/page/Welcome";
import Editor from "./pages/Editor";
import ErrorPage from "./pages/ErrorPage";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Welcome />,
      },
      {
        path: "/editor",
        element: <Editor />,
      },
      {
        path: "/code",
        element: <NotFound />,
      },
      {
        path: "/enclosures",
        element: <NotFound />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
