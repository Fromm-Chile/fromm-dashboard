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
              Go back
            </button>
          </div>
          <h1 className="text-3xl font-bold text-red-500 pb-4 mt-2 mb-4">
            Technical Service Details
          </h1>
          <div className="w-full max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Contact Information
              </h2>
              <div className="flex justify-between items-center mb-4 bg-gray-100 p-4 rounded-lg ">
                <div className="flex gap-5">
                  <div>
                    <p className="text-gray-700">
                      <strong>Contact:</strong> #{contacto.id}
                    </p>
                    <p className="text-gray-700">
                      <strong>Name:</strong> {contacto.name || "Not available"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      {contacto.email || "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Phone:</strong>{" "}
                      {contacto.phone || "Not registered"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Company:</strong>{" "}
                      {contacto.company || "Not registered"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Equipment:</strong>{" "}
                      {contacto.equipment || "Not registered"}
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
                      Service Completed
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Message
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">
                  {contacto.message || "No message available."}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Additional Information
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex gap-10">
                {contacto.status === "SERVICE" && (
                  <p className="text-gray-700">
                    <strong>Equipment:</strong>{" "}
                    {contacto.equipment || "Not specified"}
                  </p>
                )}
                <p className="text-gray-700">
                  <strong>Creation date:</strong>{" "}
                  {contacto.createdAt
                    ? new Date(contacto.createdAt).toLocaleDateString("en-US")
                    : "Not available"}
                </p>
                <p className="text-gray-700">
                  <strong>Last update:</strong>{" "}
                  {contacto.updatedAt
                    ? new Date(contacto.updatedAt).toLocaleDateString("en-US")
                    : "Not available"}
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
                  Change status to <strong>COMPLETED</strong>
                </p>
              }
              onSubmit={handleStatusFinalizado}
              titleComment="Comment (optional)"
            >
              <div>
                <p className="text-gray-700 text-center">
                  Are you sure you want to complete the service?
                </p>
              </div>
            </ModalConfirmacion>
          )}
        </>
      )}
    </>
  );
};
