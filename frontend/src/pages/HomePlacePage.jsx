import api from "../api/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../component/BookingWidget";
import PlaceGallery from "../component/PlaceGallery";
import AddressLink from "../component/AddressLink";

const perkLabels = {
    wifi: "Fast wifi",
    parking: "Free parking",
    tv: "TV lounge",
    pets: "Pet friendly",
    entrance: "Private entrance",
    radio: "Entertainment",
};

const HomePlacePage = () => {
    const { id } = useParams();
    const [individualPlace, setIndividualPlace] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const getPlace = async () => {
            if (!id) return;
            try {
                setErrorMessage("");
                const { data } = await api.get(`/api/places/${id}`);
                setIndividualPlace(data);
            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Place not found");
            }
        };

        getPlace();
    }, [id]);

    if (errorMessage) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 shadow-sm">
                    <h1 className="text-3xl font-black text-[#222222]">{errorMessage}</h1>
                    <p className="mt-3 font-semibold text-slate-500">This stay may have been removed or the link is no longer valid.</p>
                </div>
            </div>
        );
    }

    if (!individualPlace) {
        return <div className="mx-4 h-96 animate-pulse rounded-3xl bg-slate-200 sm:mx-6 lg:mx-8"></div>;
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
            <section className="space-y-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600">Guest favorite stay</p>
                        <h1 className="mt-2 break-words text-3xl font-black leading-tight sm:text-4xl">{individualPlace.title}</h1>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-base font-semibold text-slate-600">
                            <span>{individualPlace.maxGuests} guests</span>
                            <span>1 bedroom</span>
                            <span>1 bed</span>
                            <span>1 private bathroom</span>
                        </div>
                        <AddressLink className="mt-3 inline-flex">{individualPlace.address}</AddressLink>
                    </div>
                    <div className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200">
                        No reviews yet
                    </div>
                </div>
                <PlaceGallery place={individualPlace} />
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8">
                <div className="space-y-8">
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-2xl font-black">About this place</h2>
                        <p className="mt-4 whitespace-pre-line text-lg leading-8 text-slate-600">
                            {individualPlace.description}
                        </p>
                    </div>

                    {!!individualPlace.perks?.length && (
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-2xl font-black">What this place offers</h2>
                            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                {individualPlace.perks.map((perk) => (
                                    <div key={perk} className="rounded-2xl border border-slate-200 p-4 font-black">
                                        {perkLabels[perk] || perk}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-2xl font-black">Stay details</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <div className="rounded-2xl bg-slate-100 p-4">
                                <div className="text-sm font-bold text-slate-500">Check-in</div>
                                <div className="mt-1 text-xl font-black">{individualPlace.checkIn}</div>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-4">
                                <div className="text-sm font-bold text-slate-500">Check-out</div>
                                <div className="mt-1 text-xl font-black">{individualPlace.checkOut}</div>
                            </div>
                            <div className="rounded-2xl bg-slate-100 p-4">
                                <div className="text-sm font-bold text-slate-500">Guests</div>
                                <div className="mt-1 text-xl font-black">{individualPlace.maxGuests}</div>
                            </div>
                        </div>
                    </div>

                    {!!individualPlace.extraInfo && (
                        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-2xl font-black">Good to know</h2>
                            <p className="mt-3 text-lg leading-8 text-slate-600">{individualPlace.extraInfo}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="rounded-3xl bg-emerald-50 p-5 text-emerald-950 ring-1 ring-emerald-100">
                        <div className="text-lg font-black">Get 10% off your next trip</div>
                        <p className="mt-1 text-sm font-semibold text-emerald-800">Book this stay and keep planning your next escape.</p>
                    </div>
                    <BookingWidget place={individualPlace} />
                </div>
            </section>
        </div>
    );
};

export default HomePlacePage;
