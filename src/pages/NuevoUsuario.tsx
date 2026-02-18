import axios from "axios";
import { apiUrl } from "../assets/variables";
import { useState } from "react";
import { Loader } from "../components/Loader";
import { InputController } from "../components/InputController";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { ModalConfirmacion } from "../components/ModalConfirmacion";

const schema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  email: yup.string().email().required("Correo es requerido"),
  password: yup.string().required("Contraseña es requerido"),
  role: yup.string().required("El role es requerido"),
});

export const NuevoUsuario = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "",
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      await axios.post(`${apiUrl}/users-admin`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setModal(false);
      navigate("/usuarios");
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="m-auto max-w-[700px] bg-white border border-gray-200 rounded-xl py-8 px-10 my-8">
        <h1 className="text-center text-lg font-semibold text-slate-800 mb-6">
          Crear una nuevo usuario Administrativo
        </h1>
        <p className="text-sm text-slate-500 mb-8">
          Ingresa los datos del nuevo usuario administrativo. Recuerda que el
          <strong> correo electrónico</strong> es el que se usará para iniciar
          sesión en el panel administrativo.
        </p>
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <InputController
              control={control}
              name="name"
              placeholder="Nombre*"
              error={errors.name?.message}
            />
            <InputController
              control={control}
              name="email"
              placeholder="Correo*"
              error={errors.email?.message}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-2">
            <InputController
              control={control}
              name="password"
              placeholder="Contraseña*"
              error={errors.password?.message}
            />
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <div className="mb-4">
                  <select
                    {...field}
                    className={`w-full border px-3 py-2 rounded-lg text-sm focus-visible:border-slate-400 focus-visible:outline-none transition-colors ${
                      errors.role ? "border-red-300" : "border-gray-200"
                    }`}
                  >
                    <option value="" className="text-gray-300">
                      Selecciona el Rol...
                    </option>
                    <option value="AdminChile">AdminChile</option>
                    <option value="AdminPeru">AdminPeru</option>
                    <option value="UserChile">UserChile</option>
                    <option value="UserPeru">UserPeru</option>
                    <option value="ServicioChile">ServicioChile</option>
                    <option value="ServicioPeru">ServicioPeru</option>
                  </select>
                </div>
              )}
            />
          </div>
          <div className="flex justify-center mt-4">
            <button
              className="bg-slate-900 text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:bg-slate-800 cursor-pointer transition-colors"
              onClick={handleSubmit(() => setModal(true))}
            >
              Crear Usuario
            </button>
          </div>
        </div>
        <button
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
          onClick={() => navigate("/usuarios")}
        >
          <img src="/icons/left-arrow.svg" width={14} height={14} />
          Volver
        </button>
      </div>
      <ModalConfirmacion
        text="Estás segura de crear una nueva cotización?"
        isOpen={modal}
        onSubmit={handleSubmit(onSubmit)}
        onCancel={() => setModal(false)}
        isLoading={isLoading}
        hasComment={false}
      />
    </>
  );
};
