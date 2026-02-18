import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

type ButtonProps = PropsWithChildren<{
  link: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  className?: string;
  whiteButton?: boolean;
}>;

export const Button = ({
  children,
  link,
  onClick,
  className,
  whiteButton,
}: ButtonProps) => {
  return (
    <div className="w-fit m-auto">
      <Link to={link} onClick={onClick}>
        <div
          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
            whiteButton
              ? "bg-white text-slate-600 border border-gray-200 hover:bg-gray-50 hover:text-slate-800"
              : "bg-slate-900 text-white hover:bg-slate-800"
          } ${className}`}
        >
          {children}
        </div>
      </Link>
    </div>
  );
};
