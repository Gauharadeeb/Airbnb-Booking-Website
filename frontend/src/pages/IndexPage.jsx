{/* Search Section */}
<section className="sticky top-20 z-30 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">

    <div className="flex flex-col gap-2 md:flex-row">

        {/* Location */}
        <div className="flex-1 px-4 py-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
                Where
            </label>

            <input
                type="text"
                placeholder="Nearby"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
            />
        </div>

        {/* Date */}
        <div className="flex-1 border-l border-slate-300 px-4 py-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
                When
            </label>

            <input
                type="text"
                placeholder="Add dates"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
            />
        </div>

        {/* Guests */}
        <div className="flex-1 border-l border-slate-300 px-4 py-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
                Who
            </label>

            <input
                type="text"
                placeholder="Add guests"
                value={getTotalGuests() > 0 ? getGuestsText() : ""}
                readOnly
                className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
            />
        </div>

        {/* Search Button */}
        <button className="rounded-full bg-rose-600 p-3 text-white transition hover:bg-rose-700">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-5 w-5"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
            </svg>
        </button>

    </div>
</section>