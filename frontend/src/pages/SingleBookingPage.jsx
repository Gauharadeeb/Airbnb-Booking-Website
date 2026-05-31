import { Navigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AddressLink from "../component/AddressLink";
import PlaceGallery from "../component/PlaceGallery";
import BookingDates from "../component/BookingDates";
import { formatPrice } from "../utils/formatters";
import { UserContext } from "../UserContext";

const SingleBookingPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const { ready, user } = useContext(UserContext);

  useEffect(() => {
    if (!id || !user) return;
    axios.get(`/api/bookings/${id}`).then(response => {
      setBooking(response.data.data);
    });
  }, [id, user]);

  if (!ready) {
    return <div className="h-96 animate-pulse rounded-3xl bg-slate-200"></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!booking) {
    return <div className="h-96 animate-pulse rounded-3xl bg-slate-200"></div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <section className="grid gap-6 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 lg:grid-cols-[minmax(0,1fr)_22rem] lg:p-7">
        <div className="min-w-0">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600">Trip details</p>
          <h1 className="mt-2 break-words text-3xl font-black leading-tight text-[#222222] sm:text-4xl">{booking.place.title}</h1>
          <AddressLink className="mt-3 inline-flex">{booking.place.address}</AddressLink>
        </div>
        <div className="rounded-3xl bg-[#F7F7F7] p-5 ring-1 ring-slate-200">
          <div className="text-sm font-black uppercase text-slate-500">Total price</div>
          <div className="mt-2 text-4xl font-black text-[#222222]">{formatPrice(booking.price)}</div>
          <p className="mt-2 text-sm font-bold text-slate-500">Confirmation ready</p>
        </div>
      </section>

      <section className="grid gap-5 rounded-[2rem] bg-[#222222] p-5 text-white shadow-xl shadow-black/10 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div>
          <h2 className="text-2xl font-black">Your booking information</h2>
          <BookingDates booking={booking} className="mt-4 flex-wrap text-slate-200" />
          <div className="mt-5 flex flex-wrap gap-3 text-sm font-black">
            <span className="rounded-full bg-white/10 px-4 py-2">{booking.numberOfGuests} guests</span>
            <span className="rounded-full bg-emerald-400/15 px-4 py-2 text-emerald-100">Booking confirmed</span>
          </div>
        </div>
        <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/10">
          <div className="text-sm font-black uppercase text-white/60">Stay snapshot</div>
          <p className="mt-3 text-sm font-semibold leading-6 text-white/75">
            Your trip details and property gallery are saved here for quick review before check-in.
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-[2rem] bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:p-4">
        <PlaceGallery place={booking.place} />
      </section>
    </div>
  );
};

export default SingleBookingPage;
