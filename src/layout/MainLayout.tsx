import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLocation, useNavigate, Outlet } from "react-router-dom"
import Footer from "@/components/Footer";

const tabs = [
    { name: "O mne", path: "/" },
    { name: "Projekty", path: "/projects" },
    { name: "Zamestnania", path: "/jobs" },
    { name: "Kontakt", path: "/contact" },
]

export default function MainLayout() {
    const location = useLocation()
    const navigate = useNavigate()

    const currentPath = location.pathname

    return (
        <div>
            <Tabs value={currentPath} onValueChange={(val) => navigate(val)} >
                <TabsList>
                    {tabs.map(({ name, path }) => (
                        <TabsTrigger key={path} value={path} className="capitalize">
                            {name}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <Outlet />

            <Footer />
        </div>
    )
}