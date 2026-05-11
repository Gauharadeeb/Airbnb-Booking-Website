import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useRef, useEffect } from "react";
import { UserContext } from "../UserContext.jsx";
import { useFavorites } from "../FavoritesContext.jsx";

const Navbar = () => {
    const { user } = useContext(UserContext);
    const { favorites } = useFavorites();
    const location = useLocation();
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [searchData, setSearchData] = useState({
        where: '',
        when: '',
        who: ''
    });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [showWhoDropdown, setShowWhoDropdown] = useState(false);
    const [guests, setGuests] = useState({
        adults: 0,
        children: 0,
        infants: 0,
        pets: 0,
    });

    const isActive = (path) => location.pathname === path;

    const suggestions = [
        { name: "Nearby", description: "Find what's around you" },
        { name: "Noida, Uttar Pradesh", description: "Near you" },
        { name: "Dehradun, Uttarakhand", description: "For nature lovers" },
        { name: "Gurgaon District, Haryana", description: "Popular with travellers near you" },
        { name: "Rishikesh, Uttarakhand", description: "For nature lovers" },
        { name: "Manali, Himachal Pradesh", description: "A hidden gem" }
    ];

    const whereRef = useRef(null);
    const whenRef = useRef(null);
    const whoRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (whereRef.current && !whereRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (whenRef.current && !whenRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
            if (whoRef.current && !whoRef.current.contains(event.target)) {
                setShowWhoDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLocationChange = (value) => {
        setSearchData({ ...searchData, where: value });
        if (value.length > 0) {
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectLocation = (location) => {
        setSearchData({ ...searchData, where: location });
        setShowSuggestions(false);
    };

    const updateGuests = (type, increment) => {
        setGuests(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + (increment ? 1 : -1))
        }));
    };

    const getTotalGuests = () => {
        return guests.adults + guests.children + guests.infants;
    };

    const getGuestsText = () => {
        const total = getTotalGuests();
        if (total === 0) return 'Add guests';
        if (total === 1) return '1 guest';
        return `${total} guests`;
    };

    return (
        <>
            <header className="fixed left-0 top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-[112rem] items-center justify-between gap-4 px-5 py-5 lg:px-12">
                    <Link to="/" className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-600 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-6 w-6 -rotate-90">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </span>
                        <div>
                            <h1 className="text-2xl font-black text-rose-600">airbnb</h1>
                            <p className="hidden text-xs font-semibold text-slate-500 sm:block">Homes, services, and local experiences</p>
                        </div>
                    </Link>

                    <nav className="hidden items-center gap-8 lg:flex">
                        <Link 
                            to="/" 
                            className={`text-sm font-semibold transition ${isActive('/') ? 'text-slate-950 underline decoration-2 underline-offset-8' : 'text-slate-700 hover:text-slate-950'}`}
                        >
                            Homes
                        </Link>
                        <Link 
                            to="/experiences" 
                            className={`relative text-sm font-semibold transition ${isActive('/experiences') ? 'text-slate-950 underline decoration-2 underline-offset-8' : 'text-slate-700 hover:text-slate-950'}`}
                        >
                            Experiences
                            <span className="absolute -top-2 -right-4 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
                        </Link>
                        <Link 
                            to="/services" 
                            className={`relative text-sm font-semibold transition ${isActive('/services') ? 'text-slate-950 underline decoration-2 underline-offset-8' : 'text-slate-700 hover:text-slate-950'}`}
                        >
                            Services
                            <span className="absolute -top-2 -right-4 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold shadow-sm hover:shadow-md md:flex md:items-center md:gap-2">
                            <div className="flex-1 border-r border-slate-300 px-4 py-2 relative" ref={whereRef}>
                                <input
                                    type="text"
                                    placeholder="Nearby"
                                    value={searchData.where}
                                    onChange={(e) => handleLocationChange(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                                />
                            </div>
                            <div className="flex-1 border-r border-slate-300 px-4 py-2 relative" ref={whenRef}>
                                <input
                                    type="text"
                                    placeholder="Add dates"
                                    value={searchData.when}
                                    onFocus={() => setShowCalendar(true)}
                                    readOnly
                                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1 px-4 py-2 relative" ref={whoRef}>
                                <input
                                    type="text"
                                    placeholder={getGuestsText()}
                                    value={getTotalGuests() > 0 ? getGuestsText() : ''}
                                    onFocus={() => setShowWhoDropdown(true)}
                                    readOnly
                                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 cursor-pointer"
                                />
                            </div>
                            <button className="rounded-full bg-rose-600 p-2 text-white hover:bg-rose-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-4 w-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>

                        {/* Location Suggestions */}
                        {showSuggestions && searchData.where && (
                            <div className="absolute top-full left-0 mt-2 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                                <h3 className="mb-3 text-sm font-semibold text-slate-700">Suggested destinations</h3>
                                <div className="space-y-2">
                                    {suggestions.map((suggestion, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => selectLocation(suggestion.name)}
                                            className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-slate-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{suggestion.name}</div>
                                                <div className="text-xs text-slate-500">{suggestion.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Calendar */}
                        {showCalendar && (
                            <div className="absolute top-full left-0 mt-2 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-sm font-semibold text-slate-700">Select dates</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-2">Check-in</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                            onChange={(e) => setSearchData({...searchData, when: `${e.target.value} - ${searchData.when.split(' - ')[1] || ''}`})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-2">Check-out</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                            onChange={(e) => setSearchData({...searchData, when: `${searchData.when.split(' - ')[0] || ''} - ${e.target.value}`})}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Guest Dropdown */}
                        {showWhoDropdown && (
                            <div className="absolute top-full left-0 mt-2 z-50 mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-sm font-semibold text-slate-700">Select guests</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">Adults</div>
                                            <div className="text-sm text-slate-600">Ages 13 or above</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateGuests('adults', false)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                                                disabled={guests.adults === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 text-center font-semibold">{guests.adults}</span>
                                            <button
                                                onClick={() => updateGuests('adults', true)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">Children</div>
                                            <div className="text-sm text-slate-600">Ages 2-12</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateGuests('children', false)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                                                disabled={guests.children === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 text-center font-semibold">{guests.children}</span>
                                            <button
                                                onClick={() => updateGuests('children', true)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">Infants</div>
                                            <div className="text-sm text-slate-600">Under 2</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateGuests('infants', false)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                                                disabled={guests.infants === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 text-center font-semibold">{guests.infants}</span>
                                            <button
                                                onClick={() => updateGuests('infants', true)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm">
                            <div className="ml-2 flex items-center text-slate-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 6.75h16.5m-16.5 6.75h16.5" />
                                </svg>
                            </div>
                            <Link to="/favorites" className="relative flex items-center rounded-full p-2 text-slate-700 hover:bg-slate-100">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                                {favorites.length > 0 && (
                                    <span className="absolute -top-1 -right-1 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                        {favorites.length}
                                    </span>
                                )}
                            </Link>
                            <Link to={user ? "/account" : "/login"} className="flex items-center rounded-full bg-slate-950 p-2 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.7} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </Link>
                            {!!user && (
                                <div className="hidden max-w-28 truncate pr-2 text-sm font-black capitalize sm:block">
                                    {user.name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showSearchBar && (
                    <div className="border-t border-slate-200 bg-white px-5 py-4 lg:px-12">
                        <div className="flex max-w-4xl items-center gap-4 rounded-full border border-slate-300 bg-white p-2 shadow-lg">
                            <div className="flex-1 border-r border-slate-300 px-4 py-2 relative" ref={whereRef}>
                                <label className="block text-xs font-semibold text-slate-600">Where</label>
                                <input
                                    type="text"
                                    placeholder="Nearby"
                                    value={searchData.where}
                                    onChange={(e) => handleLocationChange(e.target.value)}
                                    onFocus={() => setShowSuggestions(true)}
                                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                                />
                            </div>
                            <div className="flex-1 border-r border-slate-300 px-4 py-2 relative" ref={whenRef}>
                                <label className="block text-xs font-semibold text-slate-600">When</label>
                                <input
                                    type="text"
                                    placeholder="Add dates"
                                    value={searchData.when}
                                    onFocus={() => setShowCalendar(true)}
                                    readOnly
                                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 cursor-pointer"
                                />
                            </div>
                            <div className="flex-1 px-4 py-2 relative" ref={whoRef}>
                                <label className="block text-xs font-semibold text-slate-600">Who</label>
                                <input
                                    type="text"
                                    placeholder={getGuestsText()}
                                    value={getTotalGuests() > 0 ? getGuestsText() : ''}
                                    onFocus={() => setShowWhoDropdown(true)}
                                    readOnly
                                    className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400 cursor-pointer"
                                />
                            </div>
                            <button className="rounded-full bg-rose-600 p-3 text-white hover:bg-rose-700">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="h-5 w-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </button>
                        </div>

                        {showSuggestions && searchData.where && (
                            <div className="mx-auto mt-2 max-w-4xl rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
                                <h3 className="mb-3 text-sm font-semibold text-slate-700">Suggested destinations</h3>
                                <div className="space-y-2">
                                    {suggestions.map((suggestion, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => selectLocation(suggestion.name)}
                                            className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-slate-50"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-slate-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                            </svg>
                                            <div>
                                                <div className="text-sm font-semibold text-slate-900">{suggestion.name}</div>
                                                <div className="text-xs text-slate-500">{suggestion.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {showCalendar && (
                            <div className="mx-auto mt-2 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-sm font-semibold text-slate-700">Select dates</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-2">Check-in</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                            onChange={(e) => setSearchData({...searchData, when: `${e.target.value} - ${searchData.when.split(' - ')[1] || ''}`})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-600 mb-2">Check-out</label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                                            onChange={(e) => setSearchData({...searchData, when: `${searchData.when.split(' - ')[0] || ''} - ${e.target.value}`})}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {showWhoDropdown && (
                            <div className="mx-auto mt-2 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                                <h3 className="mb-4 text-sm font-semibold text-slate-700">Select guests</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">Adults</div>
                                            <div className="text-sm text-slate-600">Ages 13 or above</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateGuests('adults', false)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                                                disabled={guests.adults === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 text-center font-semibold">{guests.adults}</span>
                                            <button
                                                onClick={() => updateGuests('adults', true)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">Children</div>
                                            <div className="text-sm text-slate-600">Ages 2-12</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateGuests('children', false)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                                                disabled={guests.children === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 text-center font-semibold">{guests.children}</span>
                                            <button
                                                onClick={() => updateGuests('children', true)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">Infants</div>
                                            <div className="text-sm text-slate-600">Under 2</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateGuests('infants', false)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                                                disabled={guests.infants === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 text-center font-semibold">{guests.infants}</span>
                                            <button
                                                onClick={() => updateGuests('infants', true)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-slate-900">Pets</div>
                                            <div className="text-sm text-slate-600">Bringing a service animal?</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateGuests('pets', false)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100 disabled:opacity-50"
                                                disabled={guests.pets === 0}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                                </svg>
                                            </button>
                                            <span className="w-8 text-center font-semibold">{guests.pets}</span>
                                            <button
                                                onClick={() => updateGuests('pets', true)}
                                                className="rounded-full border border-slate-300 p-2 hover:bg-slate-100"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </header>
        </>
    );
};

export default Navbar;
