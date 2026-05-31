import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FilterRail, SearchBar } from "../component/Marketplace";
import { homeFilters } from "../data/marketplaceData";
import Image from "../component/Image";
import { formatPrice } from "../utils/formatters";
import StayFinderAssistant from "../component/StayFinderAssistant";

const cityShelves = [
    { title: "Popular homes in Noida", city: "noida", matches: ["noida", "greater noida"] },
    { title: "Available in Dehradun next weekend", city: "dehradun", matches: ["dehradun", "mussoorie"] },
    { title: "Stay in New Delhi", city: "delhi", matches: ["new delhi", "delhi", "lodhi"] },
    { title: "Available in Gurgaon District next weekend", city: "gurgaon", matches: ["gurgaon", "gurugram"] },
    { title: "Homes in North Goa", city: "goa", matches: ["goa", "north goa", "ashwem"] },
    { title: "Available in Rishikesh next weekend", city: "rishikesh", matches: ["rishikesh"] },
    { title: "Homes in Manali", city: "manali", matches: ["manali", "himachal"] },
    { title: "Stay in Varanasi", city: "varanasi", matches: ["varanasi", "banaras", "ghat"] },
];

function getListingCountLabel(loading, count) {
    if (loading) return "Loading homes...";
    if (count === 0) return "No homes available yet";
    return `${count} ${count === 1 ? "home" : "homes"} available`;
}

function getPlaceText(place) {
    return [place.title, place.address, place.city, place.location, place.description, place.propertyType]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
}

function getCityShelfItems(places, shelf) {
    return places.filter((place) => {
        if (!place?._id) return false;
        const text = getPlaceText(place);
        return shelf.matches.some((match) => text.includes(match));
    }).slice(0, 8);
}

function CityStayCard({ item, index, favorite, onFavorite }) {
    const image = item.photos?.[0];
    const rating = item.rating || (4.72 + (Number.parseInt(item._id.slice(-2), 16) % 28) / 100).toFixed(2);
    const content = (
        <>
            <div className="group relative h-52 overflow-hidden rounded-[1.35rem] bg-slate-100">
                <Image
                    src={image}
                    fallbackIndex={index}
                    alt={item.title}
                    className="h-full w-full rounded-[1.35rem] transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-black text-[#222222] shadow-sm">
                    Guest favourite
                </span>
                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onFavorite?.();
                    }}
                    className="absolute right-3 top-3 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)] transition hover:scale-110"
                    aria-label="Save stay"
                >
                    <svg viewBox="0 0 24 24" fill={favorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" className="h-8 w-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.49-2.1-4.5-4.69-4.5-1.93 0-3.59 1.13-4.31 2.73-.72-1.6-2.38-2.73-4.31-2.73C5.1 3.75 3 5.76 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                </button>
            </div>
            <div className="mt-3">
                <h3 className="line-clamp-2 min-h-10 text-base font-black leading-tight text-[#222222]">{item.title}</h3>
                <p className="mt-1 line-clamp-1 text-sm font-medium text-slate-500">
                    {formatPrice(Number(item.price || 0) * 2)} for 2 nights · Star {Number(rating || 4.9).toFixed(2)}
                </p>
            </div>
        </>
    );

    return (
        <article className="w-[14rem] shrink-0 sm:w-[15rem]">
            <Link to={`/place/${item._id}`} className="block">
                {content}
            </Link>
        </article>
    );
}

function CityStayShelf({ shelf, places, savedIds, onFavorite }) {
    const items = useMemo(() => getCityShelfItems(places, shelf), [places, shelf]);

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-2">
                    <h2 className="truncate text-2xl font-black tracking-tight text-[#222222]">{shelf.title}</h2>
                    <button type="button" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-[#222222] transition hover:bg-slate-200" aria-label={`View ${shelf.title}`}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                        </svg>
                    </button>
                </div>
                <div className="hidden gap-2 sm:flex">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-300">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 rotate-180">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                        </svg>
                    </span>
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-[#222222]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                        </svg>
                    </span>
                </div>
            </div>
            <div className="scrollbar-none flex gap-4 overflow-x-auto pb-3">
                {items.map((item, index) => (
                    <CityStayCard
                        key={item._id || item.id}
                        item={item}
                        index={index}
                        favorite={Boolean(item._id && savedIds.includes(item._id))}
                        onFavorite={item._id ? () => onFavorite(item._id) : undefined}
                    />
                ))}
            </div>
        </section>
    );
}

const IndexPage = () => {
    const [places, setPlaces] = useState([]);
    const [query, setQuery] = useState("");
    const [dateLabel, setDateLabel] = useState("");
    const [guests, setGuests] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [sort, setSort] = useState("recommended");
    const [maxPrice, setMaxPrice] = useState("");
    const [loading, setLoading] = useState(true);
    const [savedIds, setSavedIds] = useState(() => JSON.parse(localStorage.getItem("savedStayIds") || "[]"));

    const fetchPlaces = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get("/api/home-places", {
                params: {
                    search: query,
                    perk: activeFilter,
                    sort,
                    maxPrice: maxPrice || undefined,
                    guests: guests || undefined,
                },
            });
            setPlaces(data.places || []);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, guests, maxPrice, query, sort]);

    useEffect(() => {
        const timer = setTimeout(fetchPlaces, 250);
        return () => clearTimeout(timer);
    }, [fetchPlaces]);

    const toggleSave = (id) => {
        const next = savedIds.includes(id) ? savedIds.filter((savedId) => savedId !== id) : [...savedIds, id];
        setSavedIds(next);
        localStorage.setItem("savedStayIds", JSON.stringify(next));
    };

    const countLabel = getListingCountLabel(loading, places.length);

    return (
        <>
            <section className="bg-white px-4 pb-4 pt-5 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#222222] shadow-2xl shadow-black/10 lg:h-[430px] lg:grid-cols-[0.88fr_1.12fr] xl:h-[450px]">
                    <div className="flex min-h-[17rem] flex-col justify-center px-6 py-7 text-white sm:min-h-[19rem] sm:px-9 lg:min-h-0 lg:px-10">
                        <p className="mb-3 inline-flex w-fit rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white backdrop-blur sm:text-sm">Airbnb-style stays, curated locally</p>
                        <h1 className="max-w-xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[2.85rem]">Find stays that feel designed around you.</h1>
                        <p className="mt-3 max-w-lg text-sm font-semibold leading-6 text-white/75 sm:text-base">Browse polished homes, compare thoughtful details, and save your next favorite escape.</p>
                        <div className="mt-5 flex flex-wrap gap-3">
                            <span className="rounded-full bg-[#FF385C] px-4 py-2 text-sm font-black text-white shadow-lg shadow-[#FF385C]/25">Guest favorites</span>
                            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur">Flexible filters</span>
                            <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur">Premium homes</span>
                        </div>
                    </div>
                    <div className="relative min-h-[16rem] overflow-hidden sm:min-h-[19rem] lg:min-h-0">
                        <Image
                            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=80"
                            alt="Premium vacation home"
                            loading="eager"
                            className="absolute inset-0 h-full w-full rounded-none object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#222222]/70 via-transparent to-transparent lg:bg-gradient-to-r" />
                        <div className="absolute bottom-5 left-5 rounded-3xl bg-white/95 p-4 shadow-2xl backdrop-blur sm:p-5">
                            <p className="text-sm font-black text-[#FF385C]">Live preview</p>
                            <p className="mt-1 text-lg font-black text-[#222222] sm:text-xl">{countLabel}</p>
                        </div>
                    </div>
                </div>
            </section>

            <SearchBar
                variant="homes"
                query={query}
                onQueryChange={setQuery}
                dateLabel={dateLabel}
                onDateChange={setDateLabel}
                thirdLabel="Who"
                thirdValue={guests}
                onThirdChange={setGuests}
                onSearch={fetchPlaces}
            />

            <StayFinderAssistant places={places} loading={loading} showSection={false} />

            <div className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
                <FilterRail
                    filters={homeFilters}
                    active={activeFilter}
                    onChange={setActiveFilter}
                    extra={(
                        <>
                            <select value={sort} onChange={(event) => setSort(event.target.value)} className="shrink-0 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black outline-none transition hover:border-slate-400">
                                <option value="recommended">Recommended</option>
                                <option value="price-low">Price low to high</option>
                                <option value="price-high">Price high to low</option>
                            </select>
                            <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} className="w-36 shrink-0 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-black outline-none transition hover:border-slate-400" placeholder="Max price" type="number" />
                        </>
                    )}
                />

                {loading && (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div key={item} className="space-y-4 rounded-[1.75rem] bg-white p-3 shadow-sm ring-1 ring-black/5">
                                <div className="h-52 animate-pulse rounded-[1.5rem] bg-slate-200" />
                                <div className="space-y-2 px-1 pb-2">
                                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
                                    <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && places.length === 0 && (
                    <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                        <h2 className="text-2xl font-black text-[#222222]">No homes matched your search</h2>
                        <p className="mt-2 font-semibold text-slate-500">Try another destination, fewer guests, or a different filter.</p>
                    </section>
                )}

                {!loading && (
                    <div className="space-y-14">
                        {cityShelves.map((shelf) => (
                            <CityStayShelf
                                key={shelf.city}
                                shelf={shelf}
                                places={places}
                                savedIds={savedIds}
                                onFavorite={toggleSave}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default IndexPage;
