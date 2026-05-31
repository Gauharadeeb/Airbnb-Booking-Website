import { useMemo, useState } from "react";
import { FilterRail, HorizontalScroller, ListingCard, SearchBar, SectionHeader } from "../component/Marketplace";
import { experienceCategories, experiences } from "../data/marketplaceData";
import { useFavorites } from "../FavoritesContext.jsx";

const ExperiencesPage = () => {
    const { toggleFavorite, isFavorite } = useFavorites();
    const [query, setQuery] = useState("");
    const [dateLabel, setDateLabel] = useState("");
    const [guests, setGuests] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredExperiences = useMemo(() => {
        const search = query.trim().toLowerCase();
        return experiences.filter((item) => {
            const matchesCategory = activeCategory === "all" || item.category === activeCategory;
            const matchesSearch = !search || `${item.title} ${item.location}`.toLowerCase().includes(search);
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, query]);

    const tomorrow = filteredExperiences.slice().reverse();

    return (
        <>
            <SearchBar
                variant="experiences"
                query={query}
                onQueryChange={setQuery}
                dateLabel={dateLabel}
                onDateChange={setDateLabel}
                thirdLabel="Who"
                thirdValue={guests}
                onThirdChange={setGuests}
                onSearch={() => {}}
            />

            <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
                <FilterRail filters={experienceCategories} active={activeCategory} onChange={setActiveCategory} />

                <HorizontalScroller title={query ? `Experiences matching ${query}` : "Happening today in Gurgaon District"} subtitle="Curated tours, food walks, and hosted activities">
                    {filteredExperiences.map((experience) => (
                        <ListingCard
                            key={experience.id}
                            item={experience}
                            type="experience"
                            favorite={isFavorite(`experience-${experience.id}`)}
                            onFavorite={() => toggleFavorite({
                                id: `experience-${experience.id}`,
                                title: experience.title,
                                price: experience.price,
                                image: experience.image,
                                type: "experience",
                            })}
                        />
                    ))}
                </HorizontalScroller>

                <HorizontalScroller title="Tomorrow in Gurgaon District" subtitle="Plan ahead with flexible local hosts">
                    {tomorrow.map((experience) => (
                        <ListingCard
                            key={`tomorrow-${experience.id}`}
                            item={experience}
                            type="experience"
                            favorite={isFavorite(`experience-${experience.id}`)}
                            onFavorite={() => toggleFavorite({
                                id: `experience-${experience.id}`,
                                title: experience.title,
                                price: experience.price,
                                image: experience.image,
                                type: "experience",
                            })}
                        />
                    ))}
                </HorizontalScroller>

                <section className="rounded-[2rem] bg-slate-950 p-6 text-white sm:p-8">
                    <SectionHeader title="Why guests book experiences" subtitle="Small groups, verified hosts, and memorable local access" />
                    <div className="mt-6 grid gap-4 md:grid-cols-3">
                        {["Hosted by locals", "Easy mobile booking", "Saved favorites"].map((item) => (
                            <div key={item} className="rounded-3xl bg-white/10 p-5">
                                <h3 className="text-lg font-black">{item}</h3>
                                <p className="mt-2 text-sm font-semibold text-white/70">Designed for quick discovery and confident trip planning across devices.</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
};

export default ExperiencesPage;
