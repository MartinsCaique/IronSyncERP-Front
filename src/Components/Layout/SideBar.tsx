import { useEffect, useState } from "react";
import { AiFillAppstore } from "react-icons/ai";
import { CiLogout } from "react-icons/ci";


import logo from "../../Assets/logo.png"
import { Link, useLocation } from "react-router-dom";
import { Button } from "../Button";

export const SideBar = () => {
    const [activeLink, setActiveLink] = useState("dashboard")
    const location = useLocation()

    useEffect(() => {
        const path = location.pathname.toLowerCase()
        // Atualiza o activeLink
        if (path === '/') {
            setActiveLink('dashboard')
        } else if (path.startsWith('/cadastro')) {
            setActiveLink('cadastro')
        } else if (path === '/listas') {
            setActiveLink('listas')
        }
    }, [location.pathname])

    const isActive = (link: string) => activeLink === link

    return (
        <div className="h-[100%] w-[16.6rem] bg-white flex flex-col items-center">
            {/* Logotipo */}
            <div className="mt-8">
                <img src={logo} alt="logo" />
            </div>

            {/* Navegação */}
            <nav className="flex flex-col flex-1 mt-5 w-full">
                <div className="px-3 py-2 space-y-1">
                    <Link to={'/'}>
                        <Button
                            className={`flex items-center mb-2 space-x-3 p-3 rounded-r-lg w-full ${isActive('dashboard')
                                ? "bg-gray-100 text-primary border-l-2 border-primary"
                                : "text-gray-500 hover:bg-gray-100 hover:text-primary"
                                }`}
                            handleFunction={() => setActiveLink("dashboard")}
                            icon={<AiFillAppstore size={25} />}
                            label="Dashboard"
                        />
                    </Link>
                    <Link to='/cadastro'>
                        <Button
                            className={`flex items-center mb-2 space-x-3 p-3 rounded-r-lg w-full ${isActive('cadastro')
                                ? "bg-gray-100 text-primary border-l-2 border-primary"
                                : "text-gray-500 hover:bg-gray-100 hover:text-primary"
                                }`}
                            handleFunction={() => setActiveLink("cadastro")}
                            icon={<AiFillAppstore size={25} />}
                            label="Cadastros"
                        />
                    </Link>
                    <Link to='/listas'>
                        <Button
                            className={`flex items-center space-x-3 p-3 rounded-r-lg w-full ${isActive('listas')
                                ? "bg-gray-100 text-primary border-l-2 border-primary"
                                : "text-gray-500 hover:bg-gray-100 hover:text-primary"
                                }`}
                            handleFunction={() => setActiveLink("listas")}
                            icon={<AiFillAppstore size={25} />}
                            label="Listas"
                        />
                    </Link>
                </div>
            </nav>

            {/* Button Login */}
            <div className="w-full flex justify-center mb-4 hover:-translate-y-2 transition-all">
                <Button
                    className="flex justify-center items-center p-2 border border-black/60 w-[80%] text-black/60 hover:border-secondary hover:text-secondary"
                    handleFunction={() => { }}
                    label="Logout"
                    icon={<CiLogout className="mr-4 text-2xl" />}
                />
            </div>
        </div>
    );
};
