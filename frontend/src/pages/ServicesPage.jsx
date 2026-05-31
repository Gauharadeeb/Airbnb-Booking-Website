import { useMemo, useState } from "react";
import { FilterRail, HorizontalScroller, ListingCard, SearchBar, ServiceTile } from "../component/Marketplace";
import { serviceCategories, serviceGalleryContent, serviceListings, serviceTiles } from "../data/marketplaceData";
import { useFavorites } from "../FavoritesContext.jsx";
import Image from "../component/Image";

function ServiceCategoryGallery({ category }) {
    const fallbackCategory = category === "all" ? "photography" : category;
    const gallery = serviceGalleryContent[fallbackCategory] || serviceGalleryContent.photography;
    const images = gallery.images.slice(0, 10);

    return (
        <section className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5">
            <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="flex flex-col justify-center bg-[#222222] p-6 text-white sm:p-8 lg:p-10">
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-[#FF385C]">{gallery.eyebrow}</p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{gallery.title}</h2>
                    <p className="mt-4 text-sm font-semibold leading-6 text-white/75 sm:text-base">{gallery.description}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                        <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-black backdrop-blur">10 curated visuals</span>
                        <span className="rounded-full bg-[#FF385C] px-4 py-2 text-sm font-black text-white">Premium services</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-3 bg-[#F7F7F7] p-3 min-[480px]:grid-cols-2 sm:grid-cols-3 xl:grid-cols-5">
                    {images.map((image, index) => (
                        <button
                            key={`${fallbackCategory}-${image}`}
                            type="button"
                            className={`group relative overflow-hidden rounded-3xl bg-slate-200 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                                index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
                            }`}
                        >
                            <Image
                                src={image}
                                fallbackIndex={index}
                                alt={`${gallery.title} image ${index + 1}`}
                                className={`${index === 0 ? "h-72 sm:h-full" : "h-40 sm:h-44"} w-full rounded-3xl transition duration-700 group-hover:scale-105`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

const ServicesPage = () => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const [query, setQuery] = useState("");
    const [dateLabel, setDateLabel] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredTiles = useMemo(() => {
        return serviceTiles.filter((item) => activeCategory === "all" || item.category === activeCategory);
    }, [activeCategory]);

    const filteredListings = useMemo(() => {
        const search = query.trim().toLowerCase();
        const selectedServices = serviceType
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean);
        return serviceListings.filter((item) => {
            const matchesCategory = activeCategory === "all" || item.category === activeCategory;
            const listingText = `${item.title} ${item.location} ${item.category}`.toLowerCase();
            const matchesSearch = !search || listingText.includes(search);
            const matchesService = selectedServices.length === 0 || selectedServices.some((service) => listingText.includes(service));
            return matchesCategory && matchesSearch && matchesService;
        });
    }, [activeCategory, query, serviceType]);

    return (
        <>
            <SearchBar
                variant="services"
                query={query}
                onQueryChange={setQuery}
                dateLabel={dateLabel}
                onDateChange={setDateLabel}
                thirdLabel="Type of service"
                thirdValue={serviceType}
                onThirdChange={setServiceType}
                onSearch={() => {}}
            />

            <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
                <FilterRail filters={serviceCategories} active={activeCategory} onChange={setActiveCategory} />

                <section className="space-y-5">
                    <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">Services in Gurgaon District</h2>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
                        {filteredTiles.map((item) => (
                            <ServiceTile
                                key={item.id}
                                item={item}
                                active={serviceType === item.title}
                                onClick={() => {
                                    setServiceType(item.title);
                                    setActiveCategory(item.category);
                                }}
                            />
                        ))}
                    </div>
                </section>

                <ServiceCategoryGallery category={activeCategory} />

                <HorizontalScroller title="Discover services on StayFinder" subtitle="Professional help for memorable stays and events">
                    {filteredListings.map((service) => (
                        <ListingCard
                            key={service.id}
                            item={service}
                            type="service"
                            favorite={isFavorite(`service-${service.id}`)}
                            onFavorite={() => toggleFavorite({
                                id: `service-${service.id}`,
                                title: service.title,
                                price: service.price,
                                image: service.image,
                                type: "service",
                            })}
                        />
                    ))}
                </HorizontalScroller>

                <HorizontalScroller title="Chefs" subtitle="Private meals, brunches, and hosted dining at your stay">
                    {serviceListings.filter((item) => item.category === "food").map((service) => (
                        <ListingCard
                            key={`chef-${service.id}`}
                            item={service}
                            type="service"
                            favorite={isFavorite(`service-${service.id}`)}
                            onFavorite={() => toggleFavorite({
                                id: `service-${service.id}`,
                                title: service.title,
                                price: service.price,
                                image: service.image,
                                type: "service",
                            })}
                        />
                    ))}
                </HorizontalScroller>
            </div>
        </>
    );
};

export default ServicesPage;
