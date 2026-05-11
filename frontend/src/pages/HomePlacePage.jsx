import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../component/BookingWidget";
import PlaceGallery from "../component/PlaceGallery";
import AddressLink from "../component/AddressLink";

const HomePlacePage = () => {
    const { id } = useParams();
    const [individualPlace, setIndividualPlace] = useState(null);

    useEffect(() => {
        const getPlace = async () => {
            if (!id) return;
            const { data } = await axios.get(`/api/places/${id}`);
            setIndividualPlace(data);
        };

        getPlace();
    }, [id]);

    if (!individualPlace) {
        return <div className="h-96 animate-pulse rounded-3xl bg-slate-200"></div>;
    }

    return (
        <div className="space-y-8">
            <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <div>
                    <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600">Hosted stay</p>
                            <h1 className="mt-2 text-4xl font-black leading-tight">{individualPlace.title}</h1>
                            <AddressLink className="mt-3 inline-flex">{individualPlace.address}</AddressLink>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200">
                            Up to {individualPlace.maxGuests} guests
                        </div>
                    </div>
                    <PlaceGallery place={individualPlace} />
                </div>

                <div className="lg:pt-24">
                    <BookingWidget place={individualPlace} />
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-2xl font-black">About this place</h2>
                    <p className="mt-4 whitespace-pre-line text-lg leading-8 text-slate-600">
                        {individualPlace.description}
                    </p>
                </div>

                <div className="rounded-3xl bg-slate-950 p-6 text-white">
                    <h2 className="text-2xl font-black">Stay details</h2>
                    <div className="mt-5 grid gap-3 text-sm font-semibold text-slate-300">
                        <div className="flex justify-between rounded-2xl bg-white/10 p-4">
                            <span>Check-in</span>
                            <span className="text-white">{individualPlace.checkIn}</span>
                        </div>
                        <div className="flex justify-between rounded-2xl bg-white/10 p-4">
                            <span>Check-out</span>
                            <span className="text-white">{individualPlace.checkOut}</span>
                        </div>
                        <div className="flex justify-between rounded-2xl bg-white/10 p-4">
                            <span>Max guests</span>
                            <span className="text-white">{individualPlace.maxGuests}</span>
                        </div>
                    </div>
                </div>
            </section>

            {!!individualPlace.extraInfo && (
                <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <h2 className="text-2xl font-black">Good to know</h2>
                    <p className="mt-3 text-lg leading-8 text-slate-600">{individualPlace.extraInfo}</p>
                </section>
            )}
        </div>
    );
};

export default HomePlacePage;
