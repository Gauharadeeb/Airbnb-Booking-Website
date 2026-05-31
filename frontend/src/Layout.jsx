import Navbar from "./component/Navbar.jsx";
import {Outlet} from "react-router-dom";



const Layout = () => {
    return (
        <div className="min-h-screen overflow-x-hidden bg-[#f7f7f5] text-slate-950">
            <Navbar/>
            <main className="min-w-0">
                <Outlet/>
            </main>
        </div>
    );
};

export default Layout;
