import axios from "axios";
import { apiUrl } from "../assets/variables";
import { useState } from "react";
import { Loader } from "../components/Loader";
import { InputController } from "../components/InputController";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { ModalConfirmacion } from "../components/ModalConfirmacion";

// type adminUser = {
//   id: number;
//   email: string;
//   name: string;
//   company: string;
//   phone: string;
// };

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
      <div className="m-auto max-w-[1150px] min-h-[600px] bg-white shadow-lg rounded-lg py-6 px-36 my-10">
        <h1 className="text-center text-2xl my-10 uppercase font-medium text-gray-700">
          Crear una nuevo usuario Administrativo
        </h1>
        <p className="mb-10">
          Ingresa los datos del nuevo usuario administrativo. Recuerda que el
          <strong> correo electrónico</strong> es el que se usará para iniciar
          sesión en el panel administrativo.
        </p>
        <div className="md:grid md:grid-cols-1 md:gap-0 my-10 mb-14">
          <div className="flex w-full gap-5 mb-5">
            <InputController
              control={control}
              name="name"
              placeholder="Nombre*"
              error={errors.name?.message}
              className="w-[50%]"
            />
            <InputController
              control={control}
              name="email"
              placeholder="Correo*"
              error={errors.email?.message}
              className="w-[50%]"
            />
          </div>
          <div className="flex w-full gap-5 mb-5 flex-1/2">
            <InputController
              control={control}
              name="password"
              placeholder="Contraseña*"
              error={errors.password?.message}
              className="w-[50%]"
            />
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-[50%] mb-5 border border-gray-300 p-2 rounded-lg focus-visible:border-red-500 focus-visible:outline-none ${
                    errors.role ? "border-red-500" : "border-gray-300"
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
              )}
            />
          </div>
          <div className="flex justify-center">
            <Button
              className="border border-black rounded-lg p-2 text-textGray font-bold uppercase cursor-pointer"
              onClick={handleSubmit(() => setModal(true))}
              link=""
            >
              CREAR USUARIO
            </Button>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-2 text-lg">
          <img src="/icons/left-arrow.svg" width={15} height={15} />
          <button
            className="cursor-pointer hover:text-red-600"
            onClick={() => navigate("/usuarios")}
          >
            Volver
          </button>
        </div>
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
