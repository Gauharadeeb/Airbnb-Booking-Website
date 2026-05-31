import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Image from "./Image";
import { formatPrice } from "../utils/formatters";

const suggestionChips = [
    { label: "Beach stays", query: "beach stays" },
    { label: "Mountain homes", query: "mountain homes" },
    { label: "Family stays", query: "family stays" },
    { label: "Luxury villas", query: "luxury villas" },
    { label: "Under Rs.3000", query: "under 3000" },
    { label: "With WiFi", query: "wifi" },
];

const validSearchMatchers = [
    { filterType: "beach", message: "Here are some beach stays for you:", patterns: [/^beach(?:\s+stay|s|\s+stays)?$/] },
    { filterType: "mountain", message: "Here are some mountain homes for you:", patterns: [/^mountain(?:\s+home|s|\s+homes| stay| stays)?$/] },
    { filterType: "family", message: "Here are some family-friendly stays for you:", patterns: [/^family(?:\s+stay| stays|\s+friendly)?$/] },
    { filterType: "luxury", message: "Here are some luxury villas for you:", patterns: [/^luxury(?:\s+villa| villas| stay| stays)?$/, /^premium(?:\s+villa| villas)?$/] },
    { filterType: "budget", message: "Here are some stays under Rs.3000:", patterns: [/^(?:under|below|less than)\s+3000$/, /^budget(?:\s+stay| stays)?$/] },
    { filterType: "wifi", message: "Here are some stays with WiFi:", patterns: [/^(?:with\s+)?wi-?fi$/, /^homes?\s+with\s+wi-?fi$/, /^stays?\s+with\s+wi-?fi$/] },
];

function normalizeInput(value = "") {
    return String(value)
        .toLowerCase()
        .replace(/[₹,]/g, "")
        .replace(/[^\w\s.-]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export function classifyAssistantQuery(input) {
    const text = normalizeInput(input);

    if (!text) {
        return { type: "invalid", filterType: null };
    }

    if (/^(hi|hii|hello|hey)$/.test(text)) {
        return { type: "greeting", filterType: null };
    }

    if (/^(thanks|thank you|thankyou)$/.test(text)) {
        return { type: "thanks", filterType: null };
    }

    if (/^(ok|okay|fine|done)$/.test(text)) {
        return { type: "acknowledgement", filterType: null };
    }

    const match = validSearchMatchers.find((item) => item.patterns.some((pattern) => pattern.test(text)));
    if (match) {
        return { type: "valid_search", filterType: match.filterType };
    }

    return { type: "invalid", filterType: null };
}

function searchableText(place) {
    return normalizeInput([
        place.title,
        place.address,
        place.city,
        place.location,
        place.description,
        place.propertyType,
        ...(place.perks || []),
        ...(place.amenities || []),
    ].filter(Boolean).join(" "));
}

function matchesFilter(place, filterType) {
    const text = searchableText(place);
    const price = Number(place.price || 0);
    const guests = Number(place.maxGuests || 0);

    if (filterType === "beach") return text.includes("beach") || text.includes("coastal") || text.includes("goa");
    if (filterType === "mountain") return text.includes("mountain") || text.includes("hill") || text.includes("cabin") || text.includes("mussoorie") || text.includes("dehradun");
    if (filterType === "family") return guests >= 4 || text.includes("family") || text.includes("garden") || text.includes("spacious");
    if (filterType === "luxury") return text.includes("luxury") || text.includes("premium") || text.includes("villa") || text.includes("penthouse");
    if (filterType === "budget") return price > 0 && price <= 3000;
    if (filterType === "wifi") return text.includes("wifi") || text.includes("wi-fi") || text.includes("internet");
    return false;
}

function getAssistantMessage(classification, results) {
    if (classification.type === "greeting") {
        return "Hi! Please choose one of the available options like Beach stays, Mountain homes, Luxury villas, Under Rs.3000, or With WiFi.";
    }

    if (classification.type === "acknowledgement") {
        return "Thank you! You can choose any available option whenever you want to search stays.";
    }

    if (classification.type === "thanks") {
        return "You're welcome! Choose a stay category to continue.";
    }

    if (classification.type === "invalid") {
        return "Please choose or type one of the available options: Beach stays, Mountain homes, Family stays, Luxury villas, Under Rs.3000, or With WiFi.";
    }

    if (results.length === 0) {
        return "Sorry, I could not find matching stays for this option right now. Try another option.";
    }

    return validSearchMatchers.find((item) => item.filterType === classification.filterType)?.message
        || "Here are some stays matching your request:";
}

function getRecommendations(query, places) {
    const classification = classifyAssistantQuery(query);

    if (classification.type !== "valid_search") {
        return {
            classification,
            results: [],
            message: getAssistantMessage(classification, []),
        };
    }

    const results = places
        .filter((place) => matchesFilter(place, classification.filterType))
        .sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
        .slice(0, 4);

    return {
        classification,
        results,
        message: getAssistantMessage(classification, results),
    };
}

function FilterSummary({ filterType }) {
    if (!filterType) return null;

    const label = {
        beach: "Beach stays",
        mountain: "Mountain homes",
        family: "Family stays",
        luxury: "Luxury villas",
        budget: `Under ${formatPrice(3000)}`,
        wifi: "With WiFi",
    }[filterType];

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#222222] ring-1 ring-slate-200">
                {label}
            </span>
        </div>
    );
}

FilterSummary.propTypes = {
    filterType: PropTypes.string,
};

function AssistantCard({ place, index }) {
    return (
        <Link to={`/place/${place._id}`} className="grid grid-cols-[5.5rem_1fr] gap-3 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md">
            <Image src={place.photos?.[0]} fallbackIndex={index} alt={place.title} className="h-24 w-full rounded-xl" />
            <div className="min-w-0 py-1">
                <h4 className="line-clamp-2 text-sm font-black leading-tight text-[#222222]">{place.title}</h4>
                <p className="mt-1 line-clamp-1 text-xs font-semibold text-slate-500">{place.address || place.city}</p>
                <p className="mt-2 text-sm font-black text-[#222222]">{formatPrice(place.price)} night</p>
            </div>
        </Link>
    );
}

AssistantCard.propTypes = {
    place: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
};

function SuggestionChips({ onSelect, compact = false }) {
    return (
        <div className={`flex flex-wrap gap-2 ${compact ? "mt-3" : "mt-5"}`}>
            {suggestionChips.map((chip) => (
                <button
                    key={chip.query}
                    type="button"
                    onClick={() => onSelect(chip.query)}
                    className={`${compact ? "bg-white px-3 py-2 text-xs text-[#222222] ring-1 ring-slate-200 hover:bg-slate-50" : "bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"} rounded-full font-black transition`}
                >
                    {chip.label}
                </button>
            ))}
        </div>
    );
}

SuggestionChips.propTypes = {
    onSelect: PropTypes.func.isRequired,
    compact: PropTypes.bool,
};

export default function StayFinderAssistant({ places = [], loading = false, showSection = true }) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [query, setQuery] = useState("");
    const recommendation = useMemo(() => (query ? getRecommendations(query, places) : null), [places, query]);
    const hasActiveState = Boolean(input || query);

    function submitQuery(event) {
        event.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;
        setQuery(trimmed);
    }

    function useSuggestion(value) {
        setInput(value);
        setQuery(value);
        setOpen(true);
    }

    function clearAssistant() {
        setInput("");
        setQuery("");
    }

    function ResultsBlock({ floating = false }) {
        if (!query) return null;

        return (
            <>
                <div className={`${floating ? "rounded-2xl rounded-tr-sm p-3" : "max-w-[88%] rounded-3xl rounded-tr-sm p-4"} ml-auto bg-[#FF385C] text-sm font-black leading-6 text-white shadow-sm`}>
                    {query}
                </div>
                <div className={`${floating ? "rounded-2xl rounded-tl-sm p-3" : "rounded-3xl rounded-tl-sm p-4"} bg-white shadow-sm`}>
                    <div className="flex items-start justify-between gap-3">
                        <p className="text-sm font-black text-[#222222]">{loading ? "Loading homes..." : recommendation.message}</p>
                        <button
                            type="button"
                            onClick={clearAssistant}
                            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                            aria-label="Clear assistant response"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    </div>
                    <FilterSummary filterType={recommendation?.classification.filterType} />
                    {!loading && recommendation?.classification.type !== "valid_search" && (
                        <SuggestionChips onSelect={useSuggestion} compact />
                    )}
                    {!loading && recommendation?.results.length > 0 && (
                        <div className={`${floating ? "mt-3 grid gap-3" : "mt-4 grid gap-3 md:grid-cols-2"}`}>
                            {recommendation.results.map((place, index) => (
                                <AssistantCard key={`${floating ? "floating-" : ""}${place._id}`} place={place} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </>
        );
    }

    ResultsBlock.propTypes = {
        floating: PropTypes.bool,
    };

    return (
        <>
            {showSection && (
                <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-[2rem] bg-[#222222] shadow-xl shadow-black/10 lg:grid lg:grid-cols-[0.85fr_1.15fr]">
                        <div className="p-6 text-white sm:p-8">
                            <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FF385C]">StayFinder AI Assistant</p>
                            <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-3xl">Ask for the stay you have in mind.</h2>
                            <p className="mt-3 text-sm font-semibold leading-6 text-white/70">
                                Free rule-based search for StayFinder categories. Choose a chip or type one of the available options.
                            </p>
                            <SuggestionChips onSelect={useSuggestion} />
                        </div>
                        <div className="bg-[#F7F7F7] p-4 sm:p-6">
                            <form onSubmit={submitQuery} className="flex flex-col gap-3 sm:flex-row">
                                <input
                                    value={input}
                                    onChange={(event) => setInput(event.target.value)}
                                    placeholder="Try: beach stays, mountain homes, under 3000, wifi"
                                    className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-white px-4 font-semibold text-[#222222] outline-none transition focus:border-[#FF385C] focus:ring-4 focus:ring-[#FF385C]/15"
                                />
                                <div className="flex gap-2">
                                    {hasActiveState && (
                                        <button type="button" onClick={clearAssistant} className="min-h-12 rounded-2xl bg-white px-4 font-black text-[#222222] ring-1 ring-slate-200 transition hover:bg-slate-100">
                                            Clear
                                        </button>
                                    )}
                                    <button type="submit" className="min-h-12 flex-1 rounded-2xl bg-[#FF385C] px-6 font-black text-white shadow-lg shadow-[#FF385C]/20 transition hover:bg-[#e93051] sm:flex-none">
                                        Ask
                                    </button>
                                </div>
                            </form>

                            <div className="mt-4 space-y-4">
                                <div className="max-w-[88%] rounded-3xl rounded-tl-sm bg-white p-4 text-sm font-semibold leading-6 text-slate-600 shadow-sm">
                                    Hi, I can help with Beach stays, Mountain homes, Family stays, Luxury villas, Under Rs.3000, or With WiFi.
                                </div>
                                <ResultsBlock />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                className="fixed bottom-5 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#FF385C] text-white shadow-2xl shadow-[#FF385C]/30 transition hover:-translate-y-1 hover:bg-[#e93051] sm:right-6"
                aria-label="Open StayFinder Assistant"
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-7 w-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M12 21a9 9 0 1 0-7.5-4.03L3 21l4.03-1.5A8.96 8.96 0 0 0 12 21Z" />
                </svg>
            </button>

            {open && (
                <div className="fixed bottom-24 right-4 z-40 w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[1.75rem] bg-white shadow-2xl shadow-black/20 ring-1 ring-black/10 sm:right-6">
                    <div className="flex items-center justify-between bg-[#222222] px-5 py-4 text-white">
                        <div>
                            <p className="text-sm font-black">StayFinder AI Assistant</p>
                            <p className="text-xs font-semibold text-white/60">Free rule-based search</p>
                        </div>
                        <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Close assistant">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                            </svg>
                        </button>
                    </div>
                    <div className="max-h-[70vh] overflow-y-auto bg-[#F7F7F7] p-4">
                        <form onSubmit={submitQuery} className="flex gap-2">
                            <input
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                placeholder="Try: mountain homes"
                                className="min-h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold outline-none focus:border-[#FF385C]"
                            />
                            {hasActiveState && (
                                <button type="button" onClick={clearAssistant} className="min-h-11 rounded-2xl bg-white px-3 text-sm font-black text-[#222222] ring-1 ring-slate-200">
                                    Clear
                                </button>
                            )}
                            <button type="submit" className="min-h-11 rounded-2xl bg-[#FF385C] px-4 text-sm font-black text-white">
                                Ask
                            </button>
                        </form>
                        <SuggestionChips onSelect={useSuggestion} compact />
                        <div className="mt-4 space-y-3">
                            <div className="rounded-2xl rounded-tl-sm bg-white p-3 text-sm font-semibold text-slate-600">
                                Choose a chip or type an available option to search real StayFinder listings.
                            </div>
                            <ResultsBlock floating />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

StayFinderAssistant.propTypes = {
    places: PropTypes.array,
    loading: PropTypes.bool,
    showSection: PropTypes.bool,
};
