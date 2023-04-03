import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import Home from "./routes/home";
import Qless from "./routes/qless";
import Hue from "./routes/hue";
import Minesweeper from "./routes/minesweeper";

const router = createHashRouter([
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
        path: "/minesweeper",
        element: <Minesweeper />,
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
