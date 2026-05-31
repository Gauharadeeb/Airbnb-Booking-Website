import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext.jsx";
import { useFavorites } from "../FavoritesContext.jsx";
import UserAvatar from "./UserAvatar.jsx";

const Navbar = () => {
    const { user } = useContext(UserContext);
    const { favorites } = useFavorites();
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobileMenu = () => setMobileOpen(false);

    return (
        <header className="sticky top-0 z-40 border-b border-rose-100/80 bg-[linear-gradient(90deg,#ffffff_0%,#fff5f7_45%,#ffffff_100%)] shadow-[0_4px_22px_rgba(15,23,42,0.05)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-6 sm:py-3.5 lg:px-8">
                <Link to="/" onClick={closeMobileMenu} className="flex min-w-0 items-center gap-2 text-rose-600 sm:gap-3" aria-label="StayFinder home">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-rose-600 bg-white shadow-sm shadow-rose-100 sm:h-11 sm:w-11">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-7 w-7">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4c2.7 4.5 5.2 8.4 7.4 11.7.9 1.4-.1 3.3-1.8 3.3-2.4 0-4.2-1.1-5.6-3.1-1.4 2-3.2 3.1-5.6 3.1-1.7 0-2.7-1.9-1.8-3.3C6.8 12.4 9.3 8.5 12 4Z" />
                        </svg>
                    </span>
                    <span className="truncate text-xl font-black tracking-tight sm:text-2xl">StayFinder</span>
                </Link>

                <div className="hidden items-center gap-2 sm:flex sm:gap-3">
                    <Link to="/account/places/new" className="hidden rounded-full px-4 py-2 text-sm font-black text-slate-900 transition hover:bg-white hover:shadow-sm md:block">
                        Become a host
                    </Link>
                    <Link to="/favorites" className="relative grid h-11 w-11 place-items-center rounded-full bg-white/80 text-slate-950 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white hover:shadow-md" aria-label="Favorites">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.49-2.1-4.5-4.69-4.5-1.93 0-3.59 1.13-4.31 2.73-.72-1.6-2.38-2.73-4.31-2.73C5.1 3.75 3 5.76 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                        {favorites.length > 0 && (
                            <span className="absolute -right-1 -top-1 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-black text-white">
                                {favorites.length}
                            </span>
                        )}
                    </Link>
                    <Link to={user ? "/account" : "/login"} className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-slate-950 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white hover:shadow-md">
                        <span className="hidden text-sm font-black sm:block">{user?.name || "Login"}</span>
                        {user ? (
                            <UserAvatar user={user} className="h-8 w-8" textClassName="text-xs" />
                        ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                            </svg>
                        )}
                    </Link>
                </div>
                <button
                    type="button"
                    onClick={() => setMobileOpen((isOpen) => !isOpen)}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/85 text-slate-950 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-white sm:hidden"
                    aria-label="Open navigation menu"
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
                        </svg>
                    )}
                </button>
            </div>
            {mobileOpen && (
                <nav className="border-t border-rose-100 bg-white/95 px-3 py-3 shadow-lg backdrop-blur sm:hidden">
                    <div className="mx-auto grid max-w-7xl gap-2">
                        <Link onClick={closeMobileMenu} to={user ? "/account" : "/login"} className="flex min-h-12 items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 font-black text-slate-900">
                            <span>{user ? user.name : "Login"}</span>
                            {user ? <UserAvatar user={user} className="h-8 w-8" textClassName="text-xs" /> : null}
                        </Link>
                        <Link onClick={closeMobileMenu} to="/favorites" className="flex min-h-12 items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 font-black text-slate-900">
                            <span>Favorites</span>
                            {favorites.length > 0 && <span className="rounded-full bg-rose-600 px-2 py-1 text-xs text-white">{favorites.length}</span>}
                        </Link>
                        <Link onClick={closeMobileMenu} to="/account/places/new" className="flex min-h-12 items-center rounded-2xl bg-rose-600 px-4 py-3 font-black text-white">
                            Become a host
                        </Link>
                    </div>
                </nav>
            )}
        </header>
    );
};

export default Navbar;
