import { Link, useParams } from "react-router-dom";
import AccountNav from "../component/AccountNav";
import { useEffect, useState } from "react";
import api from "../api/client";
import PlaceImg from "../component/PlaceImg";
import { clampText, formatPrice } from "../utils/formatters";

const PlacesPage = () => {
  const { action } = useParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/places")
      .then(({ data }) => setPlaces(data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <AccountNav />
      {action !== "new" && (
        <div className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600">Host dashboard</p>
              <h1 className="mt-2 text-3xl font-black">Your accommodations</h1>
              <p className="mt-1 font-semibold text-slate-500">Manage listings, prices, photos, and guest capacity.</p>
            </div>
            <Link className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 px-5 py-3 font-black text-white hover:bg-rose-700 sm:w-auto" to="/account/places/new">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
              </svg>
              Add new place
            </Link>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl font-black">{places.length}</div>
              <div className="font-semibold text-slate-500">Active listings</div>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl font-black">{formatPrice(places.reduce((sum, place) => sum + Number(place.price || 0), 0))}</div>
              <div className="font-semibold text-slate-500">Combined nightly value</div>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl font-black">{places.reduce((sum, place) => sum + Number(place.maxGuests || 0), 0)}</div>
              <div className="font-semibold text-slate-500">Total guest capacity</div>
            </div>
          </div>

          {loading && <div className="h-40 animate-pulse rounded-3xl bg-slate-200"></div>}
          {!loading && places.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <h2 className="text-2xl font-black">No listings yet</h2>
              <p className="mt-2 font-semibold text-slate-500">Create your first place and start accepting bookings.</p>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            {places.map(place => (
              <Link key={place._id} to={`/account/places/${place._id}`} className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:shadow-xl">
                <div className="h-56">
                  <PlaceImg place={place} className="h-full rounded-none object-cover" />
                </div>
                <div className="space-y-3 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words text-xl font-black">{place.title}</h2>
                      <p className="break-words text-sm font-semibold text-slate-500">{place.address}</p>
                    </div>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">Live</span>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">{clampText(place.description)}</p>
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-slate-100 p-3 text-sm font-black">
                    <span>{formatPrice(place.price)} / night</span>
                    <span>{place.maxGuests} guests</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlacesPage;
