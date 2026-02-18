import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import { apiUrl } from "../assets/variables";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputController } from "../components/InputController";
import useAuthStore from "../store/useAuthStore";
import { useUserStore } from "../store/useUserStore";
import { useState } from "react";
import { Loader } from "../components/Loader";
import { ModalConfirmacion } from "../components/ModalConfirmacion";

type FormData = {
  email: string;
  password: string;
};

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required field"),
  password: yup.string().required("Required field"),
});

export const LogIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);

  const navigate = useNavigate();

  const { login } = useAuthStore();
  const { setUser } = useUserStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (userData: FormData) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post(`${apiUrl}/auth/login`, userData);
      if (data.isActive === false) {
        alert("Usuario inactivo");
        return;
      }
      if (data.access_token) {
        localStorage.setItem("accessToken", data.access_token);
        setUser(data);
        login();
        navigate("/inicio");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401) {
          alert("Incorrect credentials");
        } else {
          alert("Error logging in");
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="w-[380px]">
            <div className="flex flex-col items-center px-6 py-10">
              <img
                alt="Fromm"
                src="/FrommLogo.webp"
                className="h-8 w-auto mb-10"
              />
              <h2 className="text-xl font-semibold text-slate-800 mb-8">
                Log in to the admin system
              </h2>

              <form action="#" method="POST" className="w-full space-y-5">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">
                    Email
                  </label>
                  <InputController
                    name="email"
                    control={control}
                    type="email"
                    error={errors.email?.message || ""}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-500">
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                      onClick={() => setPasswordModal(true)}
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <InputController
                    name="password"
                    control={control}
                    type="password"
                    error={errors.password?.message || ""}
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors cursor-pointer"
                  onClick={handleSubmit(handleSignIn)}
                >
                  Log In
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
      {passwordModal && (
        <ModalConfirmacion
          isOpen={passwordModal}
          onCancel={() => setPasswordModal(false)}
          text={
            <p>
              You must request a new password from the general administrator!
            </p>
          }
          onSubmit={async () => {
            setPasswordModal(false);
          }}
          hasComment={false}
        ></ModalConfirmacion>
      )}
    </>
  );
};
