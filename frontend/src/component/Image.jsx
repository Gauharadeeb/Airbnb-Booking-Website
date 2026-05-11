import PropTypes from "prop-types";

export default function Image({ src, className = "", alt = "", ...rest }) {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
    src = src && src.includes('https://')
        ? src
        : `${apiBaseUrl}/api/upload-image/${src}`;
    return (
        <img
            {...rest}
            src={src}
            alt={alt}
            className={`aspect-square cursor-pointer w-full h-full rounded-2xl object-cover bg-slate-100 ${className}`}
        />
    );
}

Image.propTypes = {
    src: PropTypes.string,
    className: PropTypes.string,
    alt: PropTypes.string,
};
