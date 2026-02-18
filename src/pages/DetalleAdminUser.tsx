import { apiUrl } from "../assets/variables";
import { Button } from "../components/Button";
import { InputController } from "../components/InputController";
import { Loader } from "../components/Loader";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { useModalStates } from "../hooks/useModalStates";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Nombre es requerido"),
  email: yup.string().email().required("Correo es requerido"),
  password: yup.string().required("Contraseña es requerido"),
  role: yup.string().required("El role es requerido"),
});

export const DetalleAdminUser = () => {
  const [initialState, handleState] = useModalStates({
    editar: false,
    inhabilitar: false,
    habilitar: false,
  });
  const [actionLoader, setActionLoader] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
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

  const { id } = useParams();
  const navigate = useNavigate();

  const { data: filterUser, isLoading } = useQuery({
    queryKey: ["usuario-admin", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/users-admin/${id}`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (filterUser) {
      reset({
        name: filterUser.name,
        email: filterUser.email,
        password: "",
        role: filterUser.role.name,
      });
    }
  }, [initialState.editar]);

  const updateAdminUser = async (data: any) => {
    try {
      setActionLoader(true);
      await axios.patch(`${apiUrl}/users-admin/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      handleState("editar", false);
      navigate("/usuarios");
      setActionLoader(false);
    }
  };

  const handleEnableToggle = async (isActive: boolean) => {
    try {
      setActionLoader(true);
      await axios.patch(
        `${apiUrl}/users-admin/enable/${id}`,
        { isActive },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    } finally {
      handleState("inhabilitar", false);
      navigate("/usuarios");
      setActionLoader(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <button
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-4 mb-4 cursor-pointer transition-colors"
            onClick={() => navigate("/usuarios")}
          >
            <img src="/icons/left-arrow.svg" width={14} height={14} />
            Volver
          </button>
          <div className="max-w-[1150px] mx-auto bg-white border border-gray-200 rounded-xl p-6">
            <h1 className="text-xl font-semibold text-slate-800 mb-5">
              Usuario Administrativo
            </h1>
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Información del Usuario
              </h2>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg flex justify-between items-start">
                <div className="grid grid-cols-2 gap-x-12 gap-y-1.5">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Nombre:</span> {filterUser?.name}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Role:</span> {filterUser?.role?.name}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Email:</span> {filterUser?.email}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Ultima modificación:</span>{" "}
                    {new Date(filterUser?.updatedAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }
                    )}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button link="" onClick={() => handleState("editar", true)}>
                    Editar
                  </Button>
                  {filterUser?.isActive ? (
                    <Button
                      link=""
                      onClick={() => handleState("inhabilitar", true)}
                      whiteButton
                    >
                      Inhabilitar
                    </Button>
                  ) : (
                    <Button
                      link=""
                      onClick={() => handleState("habilitar", true)}
                    >
                      Habilitar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {initialState.editar && (
        <ModalConfirmacion
          isLoading={isLoading}
          isOpen={initialState.editar}
          onCancel={() => handleState("editar", false)}
          text={
            <p>
              Actualizar datos del <strong>Usuario</strong>
            </p>
          }
          onSubmit={handleSubmit(updateAdminUser)}
          hasComment={false}
        >
          <div className="flex flex-col w-full justify-center items-center gap-1 mt-4">
            <InputController
              control={control}
              name="name"
              placeholder="Nombre*"
              error={errors.name?.message}
              className="w-[80%]"
            />
            <InputController
              control={control}
              name="email"
              placeholder="Correo*"
              error={errors.email?.message}
              className="w-[80%]"
            />
            <InputController
              control={control}
              name="password"
              placeholder="Contraseña*"
              error={errors.password?.message}
              className="w-[80%]"
            />
            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-[80%] mb-4 border px-3 py-2 rounded-lg text-sm focus-visible:border-slate-400 focus-visible:outline-none transition-colors ${
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
              )}
            />
          </div>
        </ModalConfirmacion>
      )}
      {initialState.inhabilitar && (
        <ModalConfirmacion
          isLoading={actionLoader}
          hasComment={false}
          isOpen={initialState.inhabilitar}
          onCancel={() => handleState("inhabilitar", false)}
          text=""
          onSubmit={() => handleEnableToggle(false)}
          titleComment="Comentario (opcional)"
        >
          <div>
            <p className="text-sm text-slate-600 text-center">
              Estas seguro que quires inhabilitar este usuario?
            </p>
          </div>
        </ModalConfirmacion>
      )}
      {initialState.habilitar && (
        <ModalConfirmacion
          isLoading={actionLoader}
          hasComment={false}
          isOpen={initialState.habilitar}
          onCancel={() => handleState("habilitar", false)}
          text=""
          onSubmit={() => handleEnableToggle(true)}
          titleComment="Comentario (opcional)"
        >
          <div>
            <p className="text-sm text-slate-600 text-center">
              Estas seguro que quires habilitar este usuario?
            </p>
          </div>
        </ModalConfirmacion>
      )}
    </>
  );
};
