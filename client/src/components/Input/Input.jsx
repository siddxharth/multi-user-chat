export default function Input({
    label = "",
    name = "",
    type = "text",
    className = "",
    placeholder = "John Doe",
    isRequired = false,
    value = "",
    onChange = () => {},
}) {
    return (
        <div className="w-1/2">
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-900"
            >
                {label}
            </label>
            <input
                type={type}
                id={name}
                className={`bg-gray-50 border text-sm rounded focus:outline-primary focus:ring-primary focus:border-primary block w-full p-2.5  ${className}`}
                placeholder={placeholder}
                required={isRequired}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
