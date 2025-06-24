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
          open ? "w-[330px] p-[35px]" : "w-[73px]"
        } h-screen bg-white p-[10px] shadow-lg transition-all duration-300 overflow-y-auto relative`}
      >
        <div className="flex gap-1 items-center mb-20 mt-10">
          {open ? (
            <img
              src="https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/FROMM_PACK%20large.jpg"
              width={240}
            />
          ) : (
            <img src="/favicon.ico" width={40} />
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
        <img
          src="/icons/hide.svg"
          height={40}
          width={40}
          onClick={() => setOpen(!open)}
          className={`absolute cursor-pointer bottom-10 right-0 transition-all duration-300 ${
            open ? "" : "rotate-180"
          }`}
        />
      </aside>
      <div className="w-full h-[100vh] overflow-y-scroll">
        <header className="mb-5 text-3xl font-medium flex justify-between items-center m-auto bg-white py-2 px-20">
          <div className="flex gap-5 items-center text-gray-600">
            <h1 className="text-xl">Hello, {name}</h1>
            {roleId === 1 && (
              <select
                name="pais"
                id="pais"
                className="border-2 border-gray-200 rounded-lg px-4 py-2 bg-white text-xl focus-visible:border-red-500 focus-visible:outline-none"
                value={countryCode || ""}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  window.location.reload();
                }}
              >
                <option value="CL">🇨🇱 Chile</option>
                <option value="PE">🇵🇪 Perú</option>
              </select>
            )}
            {roleId === 2 || roleId === 4 || roleId === 6 ? (
              <p className="text-lg">🇨🇱 Fromm Chile</p>
            ) : null}
            {roleId === 3 || roleId === 5 || roleId === 7 ? (
              <p className="text-lg">🇵🇪 Fromm Perú</p>
            ) : null}
          </div>
          <div
            className="flex gap-2 items-center text-lg font-medium cursor-pointer border border-red-500 p-2 rounded-lg bg-white hover:bg-red-500 hover:text-white text-gray-600 transition-all"
            onClick={handleSignOut}
          >
            <img src="/icons/log-out.svg" width={30} height={30} />
            <p>Log out...</p>
          </div>
        </header>
        <div className="flex-1 min-w-[1200px] w-[1200px] h-[100vh] m-auto">
          <div className="max-w-[1200px] m-auto px-14">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};
