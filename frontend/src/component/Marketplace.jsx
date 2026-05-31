import PropTypes from "prop-types";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isBefore,
    isSameDay,
    isSameMonth,
    isWithinInterval,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import { formatPrice } from "../utils/formatters";
import { destinations, serviceTiles } from "../data/marketplaceData";
import Image from "./Image";

const pageTabs = [
    { to: "/", label: "Homes", icon: "home" },
    { to: "/experiences", label: "Experiences", icon: "experience", badge: "NEW" },
    { to: "/services", label: "Services", icon: "service", badge: "NEW" },
];

export function PageSwitcher() {
    const { pathname } = useLocation();

    return (
        <nav className="flex items-end justify-center gap-3 sm:gap-8" aria-label="Marketplace sections">
            {pageTabs.map((tab) => {
                const active = pathname === tab.to;
                return (
                    <Link
                        key={tab.to}
                        to={tab.to}
                        className={`relative flex min-w-20 flex-col items-center gap-1 border-b-2 px-2 pb-3 text-sm font-black transition duration-200 sm:min-w-28 sm:text-base ${
                            active ? "border-slate-950 text-slate-950" : "border-transparent text-slate-500 hover:text-slate-950"
                        }`}
                    >
                        <TabIcon type={tab.icon} />
                        <span>{tab.label}</span>
                        {tab.badge && (
                            <span className="absolute left-1/2 top-0 -translate-y-3 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-black text-white shadow">
                                {tab.badge}
                            </span>
                        )}
                    </Link>
                );
            })}
        </nav>
    );
}

function TabIcon({ type }) {
    if (type === "experience") {
        return (
            <span className="relative flex h-10 w-10 items-center justify-center">
                <span className="h-8 w-6 rounded-full bg-gradient-to-b from-rose-500 via-amber-400 to-orange-600 shadow-sm" />
                <span className="absolute bottom-1 h-2 w-4 rounded-sm bg-amber-700" />
            </span>
        );
    }

    if (type === "service") {
        return (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-950">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16h16M6 16a6 6 0 0 1 12 0M12 6V4m-2 0h4M5 19h14" />
                </svg>
            </span>
        );
    }

    return (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3 11 9-7 9 7M5 10v10h14V10M9 20v-6h6v6" />
            </svg>
        </span>
    );
}

TabIcon.propTypes = {
    type: PropTypes.string.isRequired,
};

export function SearchBar({
    variant = "homes",
    query,
    onQueryChange,
    dateLabel,
    onDateChange,
    thirdLabel,
    thirdValue,
    onThirdChange,
    onSearch,
}) {
    const wrapperRef = useRef(null);
    const [openPanel, setOpenPanel] = useState(null);
    const [visibleMonth, setVisibleMonth] = useState(startOfMonth(new Date()));
    const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 });
    const [selectedServices, setSelectedServices] = useState([]);
    const isServices = variant === "services";

    useEffect(() => {
        function handleOutsideClick(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setOpenPanel(null);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const dateSummary = useMemo(() => {
        if (!dateRange.startDate) return "";
        if (!dateRange.endDate) return format(dateRange.startDate, "MMM d");
        return `${format(dateRange.startDate, "MMM d")} - ${format(dateRange.endDate, "MMM d")}`;
    }, [dateRange]);

    function selectDate(day) {
        if (!dateRange.startDate || dateRange.endDate || isBefore(day, dateRange.startDate)) {
            const next = { startDate: day, endDate: null };
            setDateRange(next);
            onDateChange(format(day, "MMM d"));
            return;
        }

        const next = { startDate: dateRange.startDate, endDate: day };
        setDateRange(next);
        onDateChange(`${format(next.startDate, "MMM d")} - ${format(day, "MMM d")}`);
    }

    function clearDates() {
        setDateRange({ startDate: null, endDate: null });
        onDateChange("");
    }

    function updateGuests(type, delta) {
        const next = {
            ...guests,
            [type]: Math.max(0, guests[type] + delta),
        };
        setGuests(next);
        onThirdChange(formatGuestSummary(next));
    }

    function clearGuests() {
        const emptyGuests = { adults: 0, children: 0, infants: 0, pets: 0 };
        setGuests(emptyGuests);
        onThirdChange("");
    }

    function toggleService(label) {
        const next = selectedServices.includes(label)
            ? selectedServices.filter((item) => item !== label)
            : [...selectedServices, label];
        setSelectedServices(next);
        onThirdChange(formatServiceSummary(next));
    }

    function clearServices() {
        setSelectedServices([]);
        onThirdChange("");
    }

    return (
        <section className="border-b border-slate-200 bg-white">
            <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
                <PageSwitcher />
                <div ref={wrapperRef} className="relative mx-auto mt-6 max-w-5xl">
                <div className="grid overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl shadow-black/10 transition duration-300 hover:-translate-y-0.5 hover:shadow-black/15 md:grid-cols-[1.1fr_1fr_1fr_auto] md:rounded-full">
                    <SearchField
                        label="Where"
                        value={query}
                        onChange={onQueryChange}
                        placeholder={variant === "experiences" ? "Search by city or landmark" : "Search destinations"}
                        suggestions={destinations}
                    />
                    <SearchTrigger
                        label="When"
                        value={dateSummary || dateLabel}
                        placeholder="Add dates"
                        active={openPanel === "dates"}
                        onClick={() => setOpenPanel(openPanel === "dates" ? null : "dates")}
                    />
                    <SearchTrigger
                        label={thirdLabel}
                        value={thirdValue}
                        placeholder={isServices ? "Add service" : "Add guests"}
                        active={openPanel === "third"}
                        onClick={() => setOpenPanel(openPanel === "third" ? null : "third")}
                    />
                    <div className="p-2">
                        <button
                            type="button"
                            onClick={() => {
                                setOpenPanel(null);
                                onSearch();
                            }}
                            className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#FF385C] px-7 text-white shadow-lg shadow-[#FF385C]/25 transition duration-200 hover:bg-[#e93051] active:scale-[0.98]"
                            aria-label="Search"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.2-5.2M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                {openPanel === "dates" && (
                    <CalendarPanel
                        visibleMonth={visibleMonth}
                        dateRange={dateRange}
                        onPrev={() => setVisibleMonth((month) => subMonths(month, 1))}
                        onNext={() => setVisibleMonth((month) => addMonths(month, 1))}
                        onSelectDate={selectDate}
                        onClear={clearDates}
                    />
                )}
                {openPanel === "third" && !isServices && (
                    <GuestPanel guests={guests} onUpdate={updateGuests} onClear={clearGuests} />
                )}
                {openPanel === "third" && isServices && (
                    <ServiceSelectorPanel selectedServices={selectedServices} onToggle={toggleService} onClear={clearServices} />
                )}
                </div>
            </div>
        </section>
    );
}

function formatGuestSummary(guests) {
    const totalGuests = guests.adults + guests.children;
    const parts = [];

    if (totalGuests > 0) parts.push(`${totalGuests} ${totalGuests === 1 ? "guest" : "guests"}`);
    if (guests.infants > 0) parts.push(`${guests.infants} ${guests.infants === 1 ? "infant" : "infants"}`);
    if (guests.pets > 0) parts.push(`${guests.pets} ${guests.pets === 1 ? "pet" : "pets"}`);

    return parts.join(", ");
}

function formatServiceSummary(services) {
    if (services.length <= 2) return services.join(", ");
    return `${services[0]} + ${services.length - 1} more`;
}

function SearchField({ label, value, onChange, placeholder, suggestions = [], compact = false }) {
    const listId = `${label.toLowerCase().replace(/\s+/g, "-")}-suggestions`;

    return (
        <label className={`group border-t border-slate-200 px-6 py-4 transition hover:bg-slate-50 md:border-l md:border-t-0 first:md:border-l-0 ${compact ? "" : "md:px-8"}`}>
            <span className="block text-xs font-black uppercase tracking-wide text-slate-950">{label}</span>
            <input
                list={suggestions.length ? listId : undefined}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="mt-1 w-full bg-transparent text-base font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                placeholder={placeholder}
            />
            {suggestions.length > 0 && (
                <datalist id={listId}>
                    {suggestions.map((item) => (
                        <option key={item.label} value={item.value || item.label}>
                            {item.hint}
                        </option>
                    ))}
                </datalist>
            )}
        </label>
    );
}

function SearchTrigger({ label, value, placeholder, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`group border-t border-slate-200 px-6 py-4 text-left transition hover:bg-slate-50 md:border-l md:border-t-0 ${active ? "bg-white shadow-xl" : ""}`}
        >
            <span className="block text-xs font-black uppercase tracking-wide text-slate-950">{label}</span>
            <span className={`mt-1 block truncate text-base font-semibold ${value ? "text-slate-700" : "text-slate-400"}`}>
                {value || placeholder}
            </span>
        </button>
    );
}

function CalendarPanel({ visibleMonth, dateRange, onPrev, onNext, onSelectDate, onClear }) {
    const months = [visibleMonth, addMonths(visibleMonth, 1)];

    return (
        <div className="absolute left-1/2 top-[calc(100%+14px)] z-30 w-[min(100vw-2rem,58rem)] -translate-x-1/2 rounded-[2rem] bg-white p-5 shadow-2xl shadow-black/20 ring-1 ring-black/5 sm:p-8">
            <div className="mx-auto mb-6 flex max-w-sm rounded-full bg-slate-100 p-1">
                <button type="button" className="flex-1 rounded-full bg-white py-3 text-sm font-black shadow-sm">Dates</button>
                <button type="button" className="flex-1 rounded-full py-3 text-sm font-black text-slate-600">Flexible</button>
            </div>
            <div className="flex items-center justify-between">
                <button type="button" onClick={onPrev} className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Previous month">
                    <ChevronLeft />
                </button>
                <button type="button" onClick={onNext} className="grid h-10 w-10 place-items-center rounded-full text-slate-900 hover:bg-slate-100" aria-label="Next month">
                    <ChevronRight />
                </button>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
                {months.map((month) => (
                    <MonthCalendar key={month.toISOString()} month={month} dateRange={dateRange} onSelectDate={onSelectDate} />
                ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={onClear} className="rounded-full px-5 py-3 text-sm font-black text-slate-700 underline underline-offset-4">
                    Clear dates
                </button>
            </div>
        </div>
    );
}

function MonthCalendar({ month, dateRange, onSelectDate }) {
    const today = startOfDay(new Date());
    const days = eachDayOfInterval({
        start: startOfWeek(startOfMonth(month)),
        end: endOfWeek(endOfMonth(month)),
    });

    return (
        <div>
            <h3 className="mb-5 text-center text-lg font-black text-[#222222]">{format(month, "MMMM yyyy")}</h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-black text-slate-500">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                    <div key={`${day}-${index}`} className="py-2">{day}</div>
                ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1">
                {days.map((day) => {
                    const disabled = !isSameMonth(day, month) || isBefore(day, today);
                    const selected = (dateRange.startDate && isSameDay(day, dateRange.startDate)) || (dateRange.endDate && isSameDay(day, dateRange.endDate));
                    const inRange = dateRange.startDate && dateRange.endDate && isWithinInterval(day, { start: dateRange.startDate, end: dateRange.endDate });

                    return (
                        <button
                            key={day.toISOString()}
                            type="button"
                            disabled={disabled}
                            onClick={() => onSelectDate(day)}
                            className={`grid h-11 place-items-center rounded-full text-sm font-bold transition ${
                                selected
                                    ? "bg-[#222222] text-white"
                                    : inRange
                                        ? "bg-rose-50 text-[#222222]"
                                        : disabled
                                            ? "text-slate-300"
                                            : "text-[#222222] hover:bg-slate-100"
                            }`}
                        >
                            {format(day, "d")}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

const guestRows = [
    ["adults", "Adults", "Ages 13 or above"],
    ["children", "Children", "Ages 2-12"],
    ["infants", "Infants", "Under 2"],
    ["pets", "Pets", "Bringing a service animal?"],
];

function GuestPanel({ guests, onUpdate, onClear }) {
    return (
        <div className="absolute right-0 top-[calc(100%+14px)] z-30 w-[min(100vw-2rem,28rem)] rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/20 ring-1 ring-black/5">
            {guestRows.map(([key, label, hint], index) => (
                <div key={key} className={`flex items-center justify-between gap-5 py-5 ${index ? "border-t border-slate-200" : ""}`}>
                    <div>
                        <h3 className="text-lg font-black text-[#222222]">{label}</h3>
                        <p className="mt-1 text-sm font-semibold text-slate-500">{hint}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button type="button" disabled={guests[key] === 0} onClick={() => onUpdate(key, -1)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl font-black text-slate-500 disabled:opacity-40">-</button>
                        <span className="w-5 text-center font-black">{guests[key]}</span>
                        <button type="button" onClick={() => onUpdate(key, 1)} className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-xl font-black text-[#222222]">+</button>
                    </div>
                </div>
            ))}
            <div className="flex justify-end">
                <button type="button" onClick={onClear} className="rounded-full px-5 py-3 text-sm font-black text-slate-700 underline underline-offset-4">
                    Clear guests
                </button>
            </div>
        </div>
    );
}

const serviceOptions = ["Photography", "Chefs", "Massage", "Prepared meals", "Training", "Make-up", "Hair", "Spa treatments", "Catering"];

function ServiceSelectorPanel({ selectedServices, onToggle, onClear }) {
    return (
        <div className="absolute right-0 top-[calc(100%+14px)] z-30 w-[min(100vw-2rem,39rem)] rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/20 ring-1 ring-black/5">
            <div className="flex flex-wrap gap-3">
                {serviceOptions.map((service) => {
                    const selected = selectedServices.includes(service);
                    return (
                        <button
                            key={service}
                            type="button"
                            onClick={() => onToggle(service)}
                            className={`rounded-full border px-5 py-3 text-sm font-black transition ${
                                selected
                                    ? "border-[#222222] bg-[#222222] text-white"
                                    : "border-slate-200 bg-white text-[#222222] hover:border-[#FF385C]"
                            }`}
                        >
                            {service}
                        </button>
                    );
                })}
            </div>
            <div className="mt-5 flex justify-end">
                <button type="button" onClick={onClear} className="rounded-full px-5 py-3 text-sm font-black text-slate-700 underline underline-offset-4">
                    Clear services
                </button>
            </div>
        </div>
    );
}

function ChevronLeft() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
        </svg>
    );
}

function ChevronRight() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
        </svg>
    );
}

SearchField.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
    suggestions: PropTypes.array,
    compact: PropTypes.bool,
};

SearchTrigger.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    placeholder: PropTypes.string.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

CalendarPanel.propTypes = {
    visibleMonth: PropTypes.instanceOf(Date).isRequired,
    dateRange: PropTypes.object.isRequired,
    onPrev: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onSelectDate: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};

MonthCalendar.propTypes = {
    month: PropTypes.instanceOf(Date).isRequired,
    dateRange: PropTypes.object.isRequired,
    onSelectDate: PropTypes.func.isRequired,
};

GuestPanel.propTypes = {
    guests: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};

ServiceSelectorPanel.propTypes = {
    selectedServices: PropTypes.array.isRequired,
    onToggle: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
};

SearchBar.propTypes = {
    variant: PropTypes.string,
    query: PropTypes.string.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    dateLabel: PropTypes.string.isRequired,
    onDateChange: PropTypes.func.isRequired,
    thirdLabel: PropTypes.string.isRequired,
    thirdValue: PropTypes.string.isRequired,
    onThirdChange: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
};

export function FilterRail({ filters, active, onChange, extra }) {
    return (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {filters.map((filter) => (
                <button
                    key={filter.id}
                    type="button"
                    onClick={() => onChange(filter.id)}
                    className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition duration-200 ${
                        active === filter.id
                            ? "border-[#222222] bg-[#222222] text-white shadow-lg"
                            : "border-slate-200 bg-white text-slate-700 hover:border-[#FF385C] hover:text-[#222222]"
                    }`}
                >
                    {filter.label}
                </button>
            ))}
            {extra}
        </div>
    );
}

FilterRail.propTypes = {
    filters: PropTypes.array.isRequired,
    active: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    extra: PropTypes.node,
};

export function SectionHeader({ title, subtitle }) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
                {subtitle && <p className="mt-1 text-sm font-semibold text-slate-500 sm:text-base">{subtitle}</p>}
            </div>
            <div className="hidden shrink-0 gap-2 sm:flex">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-300">
                    <ArrowIcon direction="left" />
                </span>
                <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-950">
                    <ArrowIcon />
                </span>
            </div>
        </div>
    );
}

SectionHeader.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
};

function ArrowIcon({ direction = "right" }) {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-5 w-5 ${direction === "left" ? "rotate-180" : ""}`}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
        </svg>
    );
}

ArrowIcon.propTypes = {
    direction: PropTypes.string,
};

export function HorizontalScroller({ title, subtitle, children }) {
    return (
        <section className="space-y-5">
            <SectionHeader title={title} subtitle={subtitle} />
            <div className="flex gap-4 overflow-x-auto pb-5 scrollbar-none sm:gap-5">{children}</div>
        </section>
    );
}

HorizontalScroller.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    children: PropTypes.node.isRequired,
};

export function ListingCard({ item, type = "stay", favorite, onFavorite }) {
    const linkTo = type === "stay" && item._id ? `/place/${item._id}` : "#";
    const title = item.title;
    const image = item.photos?.[0] || item.image;
    const fallbackIndex = item._id ? Number.parseInt(item._id.slice(-2), 16) || 0 : title.length;
    const rating = item.rating || (item._id ? (4.72 + (Number.parseInt(item._id.slice(-2), 16) % 28) / 100).toFixed(2) : 4.91);
    const meta = type === "stay"
        ? `${formatPrice(Number(item.price || 0) * 2)} for 2 nights`
        : `From ${formatPrice(item.price)} / guest`;

    const card = (
        <>
            <div className="group relative overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-sm">
                <Image className="h-56 w-full rounded-[1.75rem] transition duration-500 group-hover:scale-105 sm:h-60" src={image} fallbackIndex={fallbackIndex} alt={title} />
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent opacity-80" />
                <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-black text-[#222222] shadow-sm">
                    {item.badge || (type === "stay" ? "Guest favorite" : "Popular")}
                </span>
                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        onFavorite?.();
                    }}
                    className="absolute right-3 top-3 rounded-full bg-black/25 p-2 text-white backdrop-blur transition hover:scale-105 hover:bg-[#FF385C]"
                    aria-label="Save"
                >
                    <HeartIcon filled={favorite} />
                </button>
            </div>
            <div className="mt-3 space-y-1">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="line-clamp-2 min-h-10 text-base font-black leading-tight text-[#222222]">{title}</h3>
                    <span className="shrink-0 rounded-full bg-[#F7F7F7] px-2.5 py-1 text-xs font-black text-[#222222]">Star {Number(rating).toFixed(2)}</span>
                </div>
                <p className="line-clamp-1 text-sm font-semibold text-slate-500">{item.address || item.location || item.duration}</p>
                <p className="text-sm font-black text-[#222222]">{meta}</p>
            </div>
        </>
    );

    return (
        <article className="market-card w-[17.5rem] shrink-0 rounded-[1.75rem] bg-white p-2 transition duration-300 hover:shadow-xl hover:shadow-black/10">
            {linkTo === "#" ? <div>{card}</div> : <Link to={linkTo}>{card}</Link>}
        </article>
    );
}

ListingCard.propTypes = {
    item: PropTypes.object.isRequired,
    type: PropTypes.string,
    favorite: PropTypes.bool,
    onFavorite: PropTypes.func,
};

export function ServiceTile({ item, active, onClick }) {
    return (
        <button type="button" onClick={onClick} className="market-card w-40 shrink-0 text-left sm:w-48">
            <Image src={item.image} alt={item.title} className={`h-36 w-full rounded-3xl transition duration-300 ${active ? "ring-4 ring-slate-950" : ""}`} />
            <h3 className="mt-3 text-base font-black text-slate-950">{item.title}</h3>
            <p className="text-sm font-semibold text-slate-500">{item.status}</p>
        </button>
    );
}

ServiceTile.propTypes = {
    item: PropTypes.object.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

function HeartIcon({ filled }) {
    return (
        <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="h-6 w-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.49-2.1-4.5-4.69-4.5-1.93 0-3.59 1.13-4.31 2.73-.72-1.6-2.38-2.73-4.31-2.73C5.1 3.75 3 5.76 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
    );
}

HeartIcon.propTypes = {
    filled: PropTypes.bool,
};
