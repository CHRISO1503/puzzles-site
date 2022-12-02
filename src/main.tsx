import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import Home from "./routes/home";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Qless from "./routes/qless";
import Hue from "./routes/hue";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/qless",
        element: <Qless />,
    },
    {
        path: "/hue",
        element: <Hue />,
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
