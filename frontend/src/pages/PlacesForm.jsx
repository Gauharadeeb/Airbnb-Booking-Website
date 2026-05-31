import { useEffect, useState } from "react";
import { Navigate, useParams } from 'react-router-dom'
import { Perks } from "../component/Perks";
import { PhotoUploader } from "../component/PhotoUploader";
import api from "../api/client";
import AccountNav from "../component/AccountNav";
import { notify } from "../utils/notifications";

export const PlacesForm = () => {

    const { id } = useParams();

    const [title, setTitle] = useState("");
    const [address, setAddress] = useState();
    const [addPhotos, setAddPhotos] = useState([]);
    const [description, setDescription] = useState("");
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo] = useState("");
    const [checkInTime, setCheckInTime] = useState("");
    const [checkOutTime, setCheckOutTime] = useState("");
    const [maxGuest, setMaxGuest] = useState(1);
    const [price, setPrice] = useState(0);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!id) return;

        api.get('/api/places/' + id).then((response) => {
            const { data } = response;
            // console.log(data)
            setTitle(data.title);
            setAddress(data.address);
            setAddPhotos(data.photos);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo)
            setCheckInTime(data.checkIn);
            setCheckOutTime(data.checkOut);
            setMaxGuest(data.maxGuests)
            setPrice(data.price)

        })

    }, [id])


    const savePlaces = async (e) => {
        e.preventDefault();

        const placeData = {
            title, address, addPhotos,
            perks, extraInfo, checkInTime,
            checkOutTime, maxGuest, description,price
        }
        try {
            if (id) {
                await api.put('/api/places', {
                    id,
                    ...placeData
                });
                notify.success('Listing updated');
            } else {
                await api.post('/api/places', placeData);
                notify.success('Listing created');
            }

            setRedirect(true)
        } catch (error) {
            notify.error(error.response?.data?.message || 'Listing save failed');
        }
    }

  

    if (redirect) {
        return <Navigate to={'/account/places'} />
    }



    return (
        <>
            <AccountNav />
            <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
                <div className="mx-auto overflow-hidden rounded-3xl bg-slate-100 shadow-sm ring-1 ring-slate-200">
                    <form className="p-4 sm:p-5" onSubmit={savePlaces}>
                        <div className="grid mb-3">
                            <label htmlFor="tittle" className="text-lg font-semibold sm:text-xl">
                                Tittle :
                            </label>
                            <input

                                type="text" required
                                name="tittle"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder=" Tittle for your place "
                                className="rounded-md bg-slate-300 p-3 outline-none"
                            />
                        </div>
                        <div className="grid mb-3">
                            <label htmlFor="address" className="text-lg font-semibold sm:text-xl">
                                Address :
                            </label>
                            <input

                                type="text" required
                                name="address"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                placeholder=" address of the place"
                                className="rounded-md bg-slate-300 p-3 outline-none"
                            />
                        </div>

                        <PhotoUploader addPhotos={addPhotos} onChange={setAddPhotos} />


                        <div className="grid mb-3">
                            <label htmlFor="description" className="text-lg font-semibold sm:text-xl">
                                Description :
                            </label>
                            <textarea
                                name="description" required
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                cols="30"
                                rows="6"
                                placeholder="Description of the place"
                                className="rounded-md bg-slate-300 p-3 outline-none"
                            ></textarea>
                        </div>


                        <Perks selected={perks} onChange={setPerks} />


                        <div className="grid mb-3">
                            <label htmlFor="extraInfo" className="text-lg font-semibold sm:text-xl">
                                Extra Info :
                            </label>
                            <input
                                type="text"
                                name="extraInfo" 
                                value={extraInfo}
                                onChange={e => setExtraInfo(e.target.value)}
                                placeholder=" address of the place"
                                className="rounded-md bg-slate-300 p-3 outline-none"
                            />
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="grid mb-3">
                                <label htmlFor="checkInTime" className="text-lg font-semibold sm:text-xl">
                                    Check in time :
                                </label>
                                <input

                                    type="text" required
                                    name="checkInTime" 
                                    value={checkInTime}
                                    onChange={e => setCheckInTime(e.target.value)}
                                    placeholder="Example: 7:00AM or 14"
                                    className="rounded-md bg-slate-300 p-3 outline-none"
                                />
                            </div>
                            <div className="grid mb-3">
                                <label htmlFor="checkOutTime" className="text-lg font-semibold sm:text-xl">
                                    Check out time :
                                </label>
                                <input

                                    type="text" required
                                    name="checkOutTime"
                                    value={checkOutTime}
                                    onChange={e => setCheckOutTime(e.target.value)}
                                    placeholder="Example: 10:00PM or 11"
                                    className="rounded-md bg-slate-300 p-3 outline-none"
                                />
                            </div>
                            <div className="grid mb-3">
                                <label htmlFor="maxGuest" className="text-lg font-semibold sm:text-xl">
                                    Max number of guests :
                                </label>
                                <input

                                    type="text" required
                                    name="maxGuest"
                                    value={maxGuest}
                                    onChange={e => setMaxGuest(e.target.value)}
                                    placeholder="number of guests"
                                    className="rounded-md bg-slate-300 p-3 outline-none"
                                />
                            </div>
                            <div className="grid mb-3">
                                <label htmlFor="maxGuest" className="text-lg font-semibold sm:text-xl">
                                    Price Per Night :
                                </label>
                                <input

                                    type="text" required
                                    name="maxGuest"
                                    value={price}
                                    onChange={e => setPrice(e.target.value)}
                                    placeholder="number of guests"
                                    className="rounded-md bg-slate-300 p-3 outline-none"
                                />
                            </div>
                        </div>
                        <button className="mb-5 mt-10 min-h-12 w-full rounded-2xl bg-rose-800 p-4 text-xl font-bold text-white sm:mt-14 sm:text-2xl">
                            Save
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}


export default PlacesForm;
