import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Home from "./routes/home";
import Qless from "./routes/qless";
import Hue from "./routes/hue";
import Kakuro from "./routes/kakuro";

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
    {
        path: "/kakuro",
        element: <Kakuro />,
    }
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
