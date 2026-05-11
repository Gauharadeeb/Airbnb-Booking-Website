export const formatPrice = (value) => new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
}).format(Number(value || 0));

export const shortDate = (date) => new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
}).format(new Date(date));

export const clampText = (text = "", length = 110) => {
    if (text.length <= length) return text;
    return `${text.slice(0, length).trim()}...`;
};
