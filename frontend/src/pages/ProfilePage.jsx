import { useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from '../pages/PlacesPage.jsx'
import AccountNav from "../component/AccountNav.jsx";

const ProfilePage = () => {
    const { ready, user, logoutUser } = useContext(UserContext);
    let { subpage } = useParams();
    const [redirect, setRedirect] = useState(null);
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function logout() {
        await axios.post('/api/logout');
        logoutUser();
        setRedirect('/');
    }

    if (!ready) {
        return <div className="mx-auto mt-10 h-40 max-w-lg animate-pulse rounded-3xl bg-slate-200"></div>;
    }

    if (ready && !user && !redirect) {
        return <Navigate to={'/login'} />
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }
    return (
        <div>
            <AccountNav />

            {subpage === 'profile' && (
                <div className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-2xl font-black text-white">
                        {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <h1 className="text-2xl font-black">{user.name}</h1>
                    <p className="mt-1 font-semibold text-slate-500">{user.email}</p>
                    <button onClick={logout} className="mt-6 w-full max-w-sm rounded-2xl bg-rose-600 p-3 text-lg font-black text-white hover:bg-rose-700">Logout</button>
                </div>
            )}
            {subpage === 'places' && (

                <PlacesPage />

            )}
        </div>
    );
};

export default ProfilePage;
