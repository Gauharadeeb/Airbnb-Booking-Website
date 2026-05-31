import { toast } from "react-toastify";

const baseOptions = {
    closeButton: false,
    pauseOnHover: true,
    draggable: true,
};

function showToast(type, message, options = {}) {
    toast.dismiss();
    toast[type](message, {
        ...baseOptions,
        ...options,
    });
}

export const notify = {
    success(message, options) {
        showToast("success", message, { autoClose: 2200, ...options });
    },
    error(message, options) {
        showToast("error", message, { autoClose: 3000, ...options });
    },
    warning(message, options) {
        showToast("warning", message, { autoClose: 2500, ...options });
    },
};
