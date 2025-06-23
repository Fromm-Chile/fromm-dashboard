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
  email: yup.string().email("Email no válido").required("Campo requerido"),
  password: yup.string().required("Campo requerido"),
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
          alert("Credenciales incorrectas");
        } else {
          alert("Error al iniciar sesión");
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
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-[#F5F5F5] to-[#EAEAEA]">
          <div className="rounded-xl bg-white w-[400px] h-[500px]">
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
              <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                  alt="Your Company"
                  src="/FrommLogo.webp"
                  className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                  Ingresa al sistema administrativo
                </h2>
              </div>

              <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form action="#" method="POST" className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm/6 font-medium text-gray-900"
                    >
                      Correo Electrónico
                    </label>
                    <InputController
                      name="email"
                      control={control}
                      type="email"
                      error={errors.email?.message || ""}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm/6 font-medium text-gray-900"
                      >
                        Contraseña
                      </label>
                      <div className="text-sm">
                        <a
                          href="#"
                          className="font-semibold text-red-600 hover:text-red-500"
                          onClick={() => setPasswordModal(true)}
                        >
                          Olvidaste tu contraseña?
                        </a>
                      </div>
                    </div>
                    <div className="mt-2">
                      <InputController
                        name="password"
                        control={control}
                        type="password"
                        error={errors.password?.message || ""}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                      onClick={handleSubmit(handleSignIn)}
                    >
                      Ingresar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {passwordModal && (
        <ModalConfirmacion
          // error={error || ""}
          // isLoading={modalLoader}
          isOpen={passwordModal}
          onCancel={() => setPasswordModal(false)}
          text={
            <p>
              Debes solicitar una nueva contraseña al administrador general!
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
