import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-xl px-5 py-3 font-medium transition duration-200",
        {
          "bg-blue-600 text-white hover:bg-blue-700": variant === "primary",
          "bg-slate-100 text-slate-700 hover:bg-slate-200":
            variant === "secondary",
          "bg-red-600 text-white hover:bg-red-700": variant === "danger",
        }
      )}
    >
      {children}
    </button>
  );
}




