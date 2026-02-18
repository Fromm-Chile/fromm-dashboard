import { Outlet, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { MenuItem } from "./MenuItem";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/useUserStore";
import {
  navMenu,
  navMenuAdminChile,
  navMenuServicioTecnico,
  superAdminMenu,
} from "../assets/menuData";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";

export const Layout = () => {
  const [open, setOpen] = useState(true);

  const { user, reset, setCountryCode, countryCode } = useUserStore();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { roleId, name } = user;

  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    reset();
    navigate("/login");
  };

  useEffect(() => {
    if (countryCode) {
      return;
    } else {
      if (roleId === 1) {
        setCountryCode("CL");
      }
      if (roleId === 2 || roleId === 4 || roleId === 6) {
        setCountryCode("CL");
      }
      if (roleId === 3 || roleId === 5 || roleId === 7) {
        setCountryCode("PE");
      }
    }
  }, []);

  return (
    <div className="flex w-[100vw] h-[100vh]">
      <aside
        className={`${
          open ? "w-[250px] px-5 py-6" : "w-[68px] px-3 py-6"
        } h-screen bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto relative flex flex-col`}
      >
        <div className="flex items-center mb-10 mt-2">
          {open ? (
            <img
              src="https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/FROMM_PACK%20large.jpg"
              width={180}
              className="mx-auto"
            />
          ) : (
            <img src="/favicon.ico" width={36} className="mx-auto" />
          )}
        </div>
        <MenuItem
          menuData={(() => {
            switch (roleId) {
              case 1:
                return superAdminMenu;
              case 6:
                return navMenuServicioTecnico;
              case 2:
                return navMenuAdminChile;
              default:
                return navMenu;
            }
          })()}
          isOpen={open}
        />
        <button
          onClick={() => setOpen(!open)}
          className="absolute bottom-6 right-3 p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-slate-400 hover:text-slate-600"
        >
          {open ? (
            <PanelLeftClose size={20} strokeWidth={1.5} />
          ) : (
            <PanelLeftOpen size={20} strokeWidth={1.5} />
          )}
        </button>
      </aside>
      <div className="flex-1 h-[100vh] overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-8 py-3 flex justify-between items-center">
          <div className="flex gap-4 items-center text-slate-600">
            <h1 className="text-base font-medium">Hello, {name}!</h1>
            {roleId === 1 && (
              <select
                name="pais"
                id="pais"
                className="border border-gray-200 rounded-md px-3 py-1.5 bg-white text-sm focus-visible:border-slate-400 focus-visible:outline-none transition-colors"
                value={countryCode || ""}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  window.location.reload();
                }}
              >
                <option value="CL">Chile</option>
                <option value="PE">Peru</option>
              </select>
            )}
            {roleId === 2 || roleId === 4 || roleId === 6 ? (
              <p className="text-sm text-slate-500">Fromm Chile</p>
            ) : null}
            {roleId === 3 || roleId === 5 || roleId === 7 ? (
              <p className="text-sm text-slate-500">Fromm Peru</p>
            ) : null}
          </div>
          <button
            className="flex gap-2 items-center text-sm font-medium cursor-pointer px-3 py-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-gray-100 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut size={16} strokeWidth={1.75} />
            <span>Log out</span>
          </button>
        </header>
        <div className="w-full max-w-[1200px] mx-auto px-8 py-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
