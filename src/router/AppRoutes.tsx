import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Jobs from "@/pages/Jobs";
import Projects from "@/pages/Projects";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <About />,
            },
            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "jobs",
                element: <Jobs />,
            },
            {
                path: "projects",
                element: <Projects />,
            },
        ],
    },
]);