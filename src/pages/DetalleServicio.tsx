import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { Loader } from "../components/Loader";
import { useState } from "react";
import { useModalStates } from "../hooks/useModalStates";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { Button } from "../components/Button";
import { useUserStore } from "../store/useUserStore";

export const DetalleServicio = () => {
  const [modalLoader, setModalLoader] = useState(false);
  const [initialState, handleState] = useModalStates({
    finalizado: false,
  });

  const { user = {} } = useUserStore();

  const { id } = useParams();

  const { data: contacto = {}, isLoading } = useQuery({
    queryKey: ["servicio", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/admin/contacts/${id}`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const navigate = useNavigate();

  const handleStatusFinalizado = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/contacts/finalizado`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("finalizado", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mt-5 flex items-center gap-2 text-lg pb2">
            <img src="/icons/left-arrow.svg" width={15} height={15} />
            <button
              className="cursor-pointer hover:text-red-600"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </div>
          <h1 className="text-3xl font-bold text-red-500 pb-4 mt-2 mb-4">
            Detalle del Servicio Técnico
          </h1>
          <div className="w-full max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información del Contacto
              </h2>
              <div className="flex justify-between items-center mb-4 bg-gray-100 p-4 rounded-lg ">
                <div className="flex gap-5">
                  <div>
                    <p className="text-gray-700">
                      <strong>Contacto:</strong> #{contacto.id}
                    </p>
                    <p className="text-gray-700">
                      <strong>Nombre:</strong>{" "}
                      {contacto.name || "No disponible"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      {contacto.email || "No disponible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Teléfono:</strong>{" "}
                      {contacto.phone || "No registrado"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Empresa:</strong>{" "}
                      {contacto.company || "No registrada"}
                    </p>
                    <p
                      className={`p-2 rounded-lg text-center w-fit text-white mt-2 ${
                        contacto.status.name === "PENDIENTE"
                          ? "bg-gray-400 "
                          : contacto.status.name === "FINALIZADO"
                          ? "bg-green-400"
                          : ""
                      }`}
                    >
                      <strong>{contacto.status.name}</strong>
                    </p>
                  </div>
                </div>
                <div>
                  {contacto.status.name !== "PENDIENTE" ||
                  user.roleId === 4 ||
                  user.roleId === 5 ? null : (
                    <Button
                      link=""
                      onClick={() => handleState("finalizado", true)}
                    >
                      Servicio Finalizado
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Mensaje
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {contacto.message || "No hay mensaje disponible."}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información Adicional
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex gap-10">
                {contacto.status === "SERVICE" && (
                  <p className="text-gray-700">
                    <strong>Equipo:</strong>{" "}
                    {contacto.equipment || "No especificado"}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Fecha de Creación:</strong>{" "}
                  {contacto.createdAt
                    ? new Date(contacto.createdAt).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
                <p className="text-gray-700">
                  <strong>Última Actualización:</strong>{" "}
                  {contacto.updatedAt
                    ? new Date(contacto.updatedAt).toLocaleDateString("es-ES")
                    : "No disponible"}
                </p>
              </div>
            </div>
          </div>
          {initialState.finalizado && (
            <ModalConfirmacion
              isLoading={modalLoader}
              isOpen={initialState.finalizado}
              hasComment={false}
              onCancel={() => handleState("finalizado", false)}
              text={
                <p>
                  Cambar estado a <strong>FINALIZADO</strong>
                </p>
              }
              onSubmit={handleStatusFinalizado}
              titleComment="Comentario (opcional)"
            >
              <div>
                <p className="text-gray-700 text-center">
                  Esta seguro de finalizar el servicio?
                </p>
              </div>
            </ModalConfirmacion>
          )}
        </>
      )}
    </>
  );
};
