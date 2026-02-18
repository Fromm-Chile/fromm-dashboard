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

const statusStyle: Record<string, string> = {
  PENDIENTE: "bg-gray-100 text-gray-600",
  FINALIZADO: "bg-emerald-50 text-emerald-700",
};

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
    refetchOnWindowFocus: false,
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
          <button
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-4 mb-4 cursor-pointer transition-colors"
            onClick={() => navigate(-1)}
          >
            <img src="/icons/left-arrow.svg" width={14} height={14} />
            Go back
          </button>
          <h1 className="text-xl font-semibold text-slate-800 mb-5">
            Technical Service Details
          </h1>
          <div className="w-full max-w-[1150px] mx-auto bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Contact Information
              </h2>
              <div className="flex justify-between items-start bg-gray-50 border border-gray-100 p-5 rounded-lg">
                <div className="grid grid-cols-2 gap-x-12 gap-y-1.5">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Contact:</span> #{contacto.id}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Phone:</span>{" "}
                    {contacto.phone || "Not registered"}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Name:</span> {contacto.name || "Not available"}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Company:</span>{" "}
                    {contacto.company || "Not registered"}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Email:</span>{" "}
                    {contacto.email || "Not available"}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Equipment:</span>{" "}
                    {contacto.equipment || "Not registered"}
                  </p>
                  <span
                    className={`inline-block w-fit px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${
                      statusStyle[contacto.status.name] || ""
                    }`}
                  >
                    {contacto.status.name}
                  </span>
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
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Message
              </h2>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg">
                <p className="text-sm text-slate-600 whitespace-pre-line">
                  {contacto.message || "No message available."}
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Additional Information
              </h2>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg flex gap-8">
                {contacto.status === "SERVICE" && (
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Equipment:</span>{" "}
                    {contacto.equipment || "Not specified"}
                  </p>
                )}
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Creation date:</span>{" "}
                  {contacto.createdAt
                    ? new Date(contacto.createdAt).toLocaleDateString("en-US")
                    : "Not available"}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Last update:</span>{" "}
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
                <p className="text-sm text-slate-600 text-center">
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
