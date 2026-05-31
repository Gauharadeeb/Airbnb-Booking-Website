import { useState } from "react";
import Image from "../component/Image";
import { getImageGallery } from "../utils/imageUtils";

export default function PlaceGallery({ place }) {
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const photos = getImageGallery(place?.photos, 5);

    if (showAllPhotos) {
        return (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-white">
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-3 py-3 backdrop-blur sm:px-5 sm:py-4">
                    <button onClick={() => setShowAllPhotos(false)} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-black hover:bg-slate-200 sm:px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                            <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
                        </svg>
                        Close
                    </button>
                    <h2 className="min-w-0 truncate text-center text-base font-black sm:text-lg">{place.title}</h2>
                    <div className="hidden w-20 sm:block"></div>
                </div>
                <div className="mx-auto grid max-w-5xl gap-4 p-3 sm:grid-cols-2 sm:p-5">
                    {photos.map((photo, index) => (
                    <Image key={`${photo}-${index}`} src={photo} fallbackIndex={index} alt={`${place.title} photo ${index + 1}`} loading="eager" className="h-64 rounded-3xl shadow-sm sm:h-72" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] shadow-xl shadow-black/10">
            <div className="grid h-[14rem] gap-2 min-[480px]:h-[16rem] sm:h-[19rem] lg:h-[21rem] md:grid-cols-[2fr_1fr]">
                <button type="button" onClick={() => setShowAllPhotos(true)} className="group h-full overflow-hidden bg-slate-200 text-left">
                    <Image src={photos[0]} fallbackIndex={0} alt={place.title} loading="eager" className="h-full rounded-none transition duration-700 group-hover:scale-105" />
                </button>
                <div className="hidden grid-rows-2 gap-2 md:grid">
                    <button type="button" onClick={() => setShowAllPhotos(true)} className="group overflow-hidden bg-slate-200">
                        <Image src={photos[1]} fallbackIndex={1} alt={place.title} loading="eager" className="h-full rounded-none transition duration-700 group-hover:scale-105" />
                    </button>
                    <button type="button" onClick={() => setShowAllPhotos(true)} className="group overflow-hidden bg-slate-200">
                        <Image src={photos[2]} fallbackIndex={2} alt={place.title} loading="eager" className="h-full rounded-none transition duration-700 group-hover:scale-105" />
                    </button>
                </div>
            </div>

            {photos.length > 1 && (
                <button onClick={() => setShowAllPhotos(true)} className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-2xl bg-white px-3 py-3 text-sm font-black text-slate-900 shadow-lg ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-xl sm:bottom-5 sm:right-5 sm:px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6z" clipRule="evenodd" />
                    </svg>
                    Show all photos
                </button>
            )}
        </div>
    );
}
