import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { resolveImageUrl } from "../utils/imageUtils";

function getInitials(name = "", email = "") {
    const source = name.trim() || email.trim() || "User";
    return source
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

export default function UserAvatar({ user, src, preview, className = "h-12 w-12", textClassName = "text-base" }) {
    const imageSrc = preview || src || user?.profileImage;
    const initials = getInitials(user?.name, user?.email);
    const [imageFailed, setImageFailed] = useState(false);

    useEffect(() => {
        setImageFailed(false);
    }, [imageSrc]);

    if (imageSrc && !imageFailed) {
        return (
            <img
                src={resolveImageUrl(imageSrc)}
                alt={user?.name ? `${user.name} profile` : "Profile"}
                onError={() => setImageFailed(true)}
                className={`${className} rounded-full object-cover ring-4 ring-white shadow-lg`}
            />
        );
    }

    return (
        <div className={`${className} grid place-items-center rounded-full bg-[#222222] font-black text-white shadow-lg ring-4 ring-white ${textClassName}`}>
            {initials}
        </div>
    );
}

UserAvatar.propTypes = {
    user: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string,
        profileImage: PropTypes.string,
    }),
    src: PropTypes.string,
    preview: PropTypes.string,
    className: PropTypes.string,
    textClassName: PropTypes.string,
};
