import { NavLink } from "react-router";
import type { LucideIcon } from "lucide-react";

type MenuItemProps = {
  menuData: {
    id: number;
    name: string;
    icon: LucideIcon;
    link: string;
  }[];
  isOpen: boolean;
};

export const MenuItem = ({ menuData, isOpen }: MenuItemProps) => {
  return (
    <div className="flex flex-col gap-1">
      {menuData.map((item) => (
        <NavLink
          to={item.link}
          end={item.link === "/"}
          className="group"
          key={item.id}
        >
          {({ isActive }) => (
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 text-sm ${
                isActive
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-gray-100"
              }`}
            >
              <item.icon
                size={18}
                strokeWidth={1.75}
                className="shrink-0"
              />
              {isOpen && (
                <span className="font-medium truncate">{item.name}</span>
              )}
            </div>
          )}
        </NavLink>
      ))}
    </div>
  );
};
