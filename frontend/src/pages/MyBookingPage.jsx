import { useEffect, useState } from "react";
import AccountNav from "../component/AccountNav";
import api from "../api/client";
import PlaceImg from "../component/PlaceImg";
import BookingDates from "../component/BookingDates";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatters";

const MyBookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/bookings")
      .then((response) => setBookings(response.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="mx-auto max-w-5xl px-4 pb-10 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">Trips</h1>
            <p className="mt-1 font-semibold text-slate-500">Your confirmed and upcoming stays.</p>
          </div>
        </div>

        {loading && <div className="h-40 animate-pulse rounded-3xl bg-slate-200"></div>}

        {!loading && bookings.length === 0 && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h2 className="text-2xl font-black">No trips booked yet</h2>
            <p className="mt-2 font-semibold text-slate-500">When you reserve a stay, it will appear here.</p>
          </div>
        )}

        <div className="grid gap-5">
          {bookings.map((booking) => (
            <Link to={`/account/bookings/${booking._id}`} key={booking._id} className="grid overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-xl md:grid-cols-[18rem_1fr]">
              <div className="h-64 md:h-full">
                <PlaceImg place={booking.place} className="h-full rounded-none object-cover" />
              </div>
              <div className="min-w-0 space-y-4 p-5">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-rose-600">Confirmed stay</p>
                  <h2 className="mt-1 break-words text-xl font-black sm:text-2xl">{booking.place.title}</h2>
                  <p className="break-words font-semibold text-slate-500">{booking.place.address}</p>
                </div>
                <BookingDates booking={booking} className="flex-wrap text-slate-600" />
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-100 p-4">
                  <span className="font-black">Total paid</span>
                  <span className="text-xl font-black">{formatPrice(booking.price)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookingPage;
