import { useContext, useEffect, useMemo, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { UserContext } from "../UserContext";

const formatPrice = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
}).format(value || 0);

export default function BookingWidget({ place }) {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [redirect, setRedirect] = useState("");
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            setName(user.name);
        }
    }, [user]);

    const numberOfNights = useMemo(() => {
        if (!checkIn || !checkOut) return 0;
        return differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }, [checkIn, checkOut]);

    const displayTotal = Math.max(numberOfNights, 0) * Number(place.price || 0);
    const canBook = numberOfNights > 0 && name.trim() && phone.trim();

    async function bookThisPlace() {
        if (!canBook) return;
        const response = await axios.post("/api/bookings", {
            checkIn,
            checkOut,
            numberOfGuests: Number(numberOfGuests),
            name,
            phone,
            place: place._id,
            price: displayTotal,
        });
        const bookingId = response.data.data?._id || response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
    }

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    return (
        <div className="sticky top-28 rounded-3xl bg-white p-5 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
            <div className="flex items-end justify-between gap-3">
                <div>
                    <div className="text-3xl font-black">{formatPrice(place.price)}</div>
                    <div className="text-sm font-semibold text-slate-500">per night</div>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                    Instant request
                </div>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2">
                    <label className="border-r border-slate-200 p-3">
                        <span className="text-xs font-black uppercase text-slate-500">Check in</span>
                        <input
                            type="date"
                            className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                            value={checkIn}
                            onChange={(event) => setCheckIn(event.target.value)}
                        />
                    </label>
                    <label className="p-3">
                        <span className="text-xs font-black uppercase text-slate-500">Check out</span>
                        <input
                            type="date"
                            className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                            value={checkOut}
                            onChange={(event) => setCheckOut(event.target.value)}
                        />
                    </label>
                </div>
                <label className="block border-t border-slate-200 p-3">
                    <span className="text-xs font-black uppercase text-slate-500">Guests</span>
                    <input
                        type="number"
                        min="1"
                        max={place.maxGuests || undefined}
                        className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                        value={numberOfGuests}
                        onChange={(event) => setNumberOfGuests(event.target.value)}
                    />
                </label>
                {numberOfNights > 0 && (
                    <div className="grid border-t border-slate-200 md:grid-cols-2">
                        <label className="border-b border-slate-200 p-3 md:border-b-0 md:border-r">
                            <span className="text-xs font-black uppercase text-slate-500">Name</span>
                            <input
                                className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </label>
                        <label className="p-3">
                            <span className="text-xs font-black uppercase text-slate-500">Phone</span>
                            <input
                                type="tel"
                                className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                            />
                        </label>
                    </div>
                )}
            </div>

            {numberOfNights > 0 && (
                <div className="mt-5 space-y-3 text-sm font-semibold text-slate-600">
                    <div className="flex justify-between">
                        <span>{formatPrice(place.price)} x {numberOfNights} nights</span>
                        <span>{formatPrice(displayTotal)}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-black text-slate-950">
                        <span>Total before fees</span>
                        <span>{formatPrice(displayTotal)}</span>
                    </div>
                </div>
            )}

            <button
                onClick={bookThisPlace}
                disabled={!canBook}
                className="mt-5 w-full rounded-2xl bg-rose-600 p-4 text-lg font-black text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
                Reserve stay
            </button>
        </div>
    );
}

BookingWidget.propTypes = {
    place: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        maxGuests: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }).isRequired,
};
