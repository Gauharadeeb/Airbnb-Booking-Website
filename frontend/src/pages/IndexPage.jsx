import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../FavoritesContext.jsx";

const categories = [
    { label: "All stays", perk: "all" },
    { label: "Wifi ready", perk: "wifi" },
    { label: "Parking", perk: "parking" },
    { label: "Private entry", perk: "entrance" },
    { label: "TV lounge", perk: "tv" },
];

const formatPrice = (value) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value || 0);

const IndexPage = () => {
    const { toggleFavorite, isFavorite } = useFavorites();

    const [homePlaces, setHomePlaces] = useState([]);
    const [searchLocation, setSearchLocation] = useState("");
    const [searchDate, setSearchDate] = useState("");

    const guests = {
        adults: 0,
        children: 0,
        infants: 0,
        pets: 0,
    };

    const [activePerk, setActivePerk] = useState("all");
    const [sort] = useState("recommended");
    const [maxPrice] = useState("");
    const [loading, setLoading] = useState(true);

    const getTotalGuests = () => {
        return (
            guests.adults +
            guests.children +
            guests.infants +
            guests.pets
        );
    };

    const getGuestsText = () => {
        const total = getTotalGuests();
        return `${total} guest${total > 1 ? "s" : ""}`;
    };

    useEffect(() => {
        const getAllPlaces = async () => {
            try {
                setLoading(true);

                const { data } = await axios.get("/api/home-places", {
                    params: {
                        search: searchLocation,
                        perk: activePerk,
                        sort,
                        maxPrice: maxPrice || undefined,
                    },
                });

                setHomePlaces(data.places || []);
            } catch (error) {
                console.log(error.message);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(getAllPlaces, 250);

        return () => clearTimeout(timer);
    }, [searchLocation, activePerk, sort, maxPrice]);

    const averagePrice = useMemo(() => {
        if (!homePlaces.length) return 0;

        return Math.round(
            homePlaces.reduce(
                (sum, place) => sum + Number(place.price || 0),
                0
            ) / homePlaces.length
        );
    }, [homePlaces]);

    return (
        <div className="space-y-8">

            {/* Hero Section */}
            <section className="grid gap-6 rounded-[2rem] bg-slate-950 px-5 py-8 text-white shadow-xl shadow-slate-200 md:grid-cols-[1.2fr_0.8fr] md:px-10">

                <div className="flex flex-col justify-center">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-200">
                        Curated stays
                    </p>

                    <h2 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
                        Find a place that feels booked for your mood.
                    </h2>

                    <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
                        Search destinations, filter by perks, and compare prices quickly before opening a stay.
                    </p>
                </div>

                <div className="grid content-end gap-3 rounded-3xl bg-white p-4 text-slate-950">
                    <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-2xl bg-rose-50 p-4">
                            <div className="text-3xl font-black">
                                {homePlaces.length}
                            </div>

                            <div className="text-sm font-semibold text-slate-500">
                                available stays
                            </div>
                        </div>

                        <div className="rounded-2xl bg-amber-50 p-4">
                            <div className="text-2xl font-black">
                                {formatPrice(averagePrice)}
                            </div>

                            <div className="text-sm font-semibold text-slate-500">
                                average night
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-slate-100 p-4 text-sm font-medium text-slate-600">
                        Tip: use a max budget to surface affordable homes first.
                    </div>
                </div>
            </section>

            {/* Search Section */}
            <section className="sticky top-20 z-30 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

                <div className="flex flex-col gap-2 md:flex-row">

                    {/* Location */}
                    <div className="flex-1 px-4 py-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                            Where
                        </label>

                        <input
                            type="text"
                            placeholder="Nearby"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* Date */}
                    <div className="flex-1 border-l border-slate-300 px-4 py-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                            When
                        </label>

                        <input
                            type="text"
                            placeholder="Add dates"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* Guests */}
                    <div className="flex-1 border-l border-slate-300 px-4 py-2">
                        <label className="mb-1 block text-xs font-semibold text-slate-600">
                            Who
                        </label>

                        <input
                            type="text"
                            placeholder="Add guests"
                            value={getTotalGuests() > 0 ? getGuestsText() : ""}
                            readOnly
                            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
                        />
                    </div>

                    {/* Search Button */}
                    <button className="rounded-full bg-rose-600 p-3 text-white transition hover:bg-rose-700">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className="h-5 w-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                            />
                        </svg>
                    </button>
                </div>
            </section>

            {/* Categories */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {categories.map((category) => (
                    <button
                        key={category.perk}
                        type="button"
                        onClick={() => setActivePerk(category.perk)}
                        className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition ${
                            activePerk === category.perk
                                ? "bg-slate-950 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                    >
                        {category.label}
                    </button>
                ))}
            </div>

            {/* Loading */}
            {loading && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div
                            key={item}
                            className="h-80 animate-pulse rounded-3xl bg-slate-200"
                        ></div>
                    ))}
                </div>
            )}

            {/* Empty */}
            {!loading && homePlaces.length === 0 && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <h3 className="text-2xl font-black">
                        No stays matched your filters
                    </h3>

                    <p className="mt-2 text-slate-500">
                        Try a different location, perk, or price range.
                    </p>
                </div>
            )}

        </div>
    );
};

export default IndexPage;