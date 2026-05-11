import Navbar from "./component/Navbar.jsx";
import {Outlet} from "react-router-dom";



const Layout = () => {
    return (
        <div className="min-h-screen bg-[#f7f7f5] text-slate-950" >
            <Navbar/>
            <main className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:pt-28 sm:px-6 lg:px-8">
                <Outlet/>
            </main>
        </div>
    );
};

export default Layout;
