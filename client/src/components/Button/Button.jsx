export default function Button({
    type = "button",
    label = "Button",
    className = "",
    disabled = false,
    onClick = () => {},
}) {
    return (
        <div className="w-1/2">
            <button
                type={type}
                className={`text-white bg-primary hover:bg-primary-light focus:ring-2 focus:outline-none focus:ring-primary font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center ${className}`}
                disabled={disabled}
                onClick={onClick}
            >
                {label}
            </button>
        </div>
    );
}
