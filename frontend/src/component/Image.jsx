import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { getFallbackImage, getFinalFallbackImage, getImageUrl } from "../utils/imageUtils";

export default function Image({ src, className = "", alt = "", fallbackIndex = 0, ...rest }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(getImageUrl(src, fallbackIndex));
    const [fallbackStep, setFallbackStep] = useState(0);

    useEffect(() => {
        setIsLoaded(false);
        setFallbackStep(0);
        setCurrentSrc(getImageUrl(src, fallbackIndex));
    }, [fallbackIndex, src]);

    return (
        <span className={`relative block h-full w-full overflow-hidden bg-slate-100 ${className.includes("rounded") ? "" : "rounded-2xl"} ${className}`}>
            {!isLoaded && (
                <span className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
            )}
            <img
                {...rest}
                src={currentSrc}
                alt={alt}
                loading={rest.loading || "eager"}
                decoding="async"
                referrerPolicy="no-referrer"
                onLoad={(event) => {
                    setIsLoaded(true);
                    rest.onLoad?.(event);
                }}
                onError={(event) => {
                    const fallbackSrc = getFallbackImage(fallbackIndex);
                    const finalFallbackSrc = getFinalFallbackImage();

                    if (fallbackStep === 0 && currentSrc !== fallbackSrc) {
                        setIsLoaded(false);
                        setFallbackStep(1);
                        setCurrentSrc(fallbackSrc);
                        return;
                    }

                    if (currentSrc !== finalFallbackSrc) {
                        setIsLoaded(false);
                        setFallbackStep(2);
                        setCurrentSrc(finalFallbackSrc);
                        return;
                    }

                    setIsLoaded(true);
                    rest.onError?.(event);
                }}
                className={`h-full w-full object-cover transition duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
            />
        </span>
    );
}

Image.propTypes = {
    src: PropTypes.string,
    className: PropTypes.string,
    alt: PropTypes.string,
    fallbackIndex: PropTypes.number,
};
