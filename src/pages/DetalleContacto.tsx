import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { Loader } from "../components/Loader";
import { SelectTable } from "../components/SelectTable";
import { useModalStates } from "../hooks/useModalStates";
import { useState } from "react";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { useUserStore } from "../store/useUserStore";

const statusStyle: Record<string, string> = {
  PENDIENTE: "bg-gray-100 text-gray-600",
  "COTIZACIÓN": "bg-emerald-50 text-emerald-700",
  DERIVADA: "bg-blue-50 text-blue-700",
};

export const DetalleContacto = () => {
  const [estatus, setEstatus] = useState<string | null>(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [department, setDepartment] = useState<string>("");
  const [otro, setOtro] = useState<string>("");
  const [initialState, handleState] = useModalStates(
    {
      derivada: false,
      cotizado: false,
      servicio: false,
    },
    (_, isOpen) => {
      if (!isOpen) {
        setEstatus(null);
      }
    }
  );

  const { user = {} } = useUserStore();

  const { id } = useParams();

  const { data: contacto = {}, isLoading } = useQuery({
    queryKey: ["contacto", id],
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

  const handleClick = (value: string) => {
    console.log(value);
    handleState(value, true);
  };

  const handleStatusCotizado = async () => {
    try {
      setModalLoader(true);
      await axios.post(
        `${apiUrl}/admin/invoices/invoice-from-contact`,
        {
          data: {
            email: contacto.email,
            name: contacto.name,
            phone: contacto.phone,
            company: contacto.company,
            message: contacto.message,
            countryId: contacto.user.contryId,
          },
          contactId: Number(id),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("cotizado", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  const handleStatusServicio = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/contacts`,
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
      handleState("servicio", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  const handleStatusDerivado = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/contacts/derivado`,
        { id, department: department === "Otro" ? otro : department },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("cotizado", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  console.log(department);

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
            Contact Details
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
                    <SelectTable
                      selectOptions={[
                        { value: "cotizado", texto: "QUOTED" },
                        { value: "servicio", texto: "SERVICE" },
                        { value: "derivada", texto: "REFERRED" },
                      ]}
                      label="Contact status"
                      onChange={(e) => {
                        setEstatus(e.target.value);
                        handleClick(e.target.value);
                      }}
                      value={estatus || ""}
                      disabled={contacto.status.name !== "PENDIENTE"}
                    />
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
          {initialState.derivada && (
            <ModalConfirmacion
              isLoading={modalLoader}
              hasComment={false}
              isOpen={initialState.derivada}
              onCancel={() => handleState("derivada", false)}
              text={
                <p>
                  Change status to <strong>REFERRED</strong>
                </p>
              }
              onSubmit={handleStatusDerivado}
              titleComment="Comment (optional)"
            >
              <div className="w-[80%] mx-auto mt-4 mb-2">
                <SelectTable
                  label="Select area"
                  selectOptions={[
                    {
                      value: "Gerencia Comercial",
                      texto: "Sales Management",
                    },
                    { value: "Compras", texto: "Purchasing" },
                    { value: "Recursos Humanos", texto: "Human Resources" },
                    { value: "Comex", texto: "Comex" },
                    { value: "Logística", texto: "Logistics" },
                    { value: "Otro", texto: "Other" },
                  ]}
                  onChange={(e) => setDepartment(e.target.value)}
                  value={department || ""}
                />
                {department === "Otro" && (
                  <input
                    type="text"
                    placeholder="Specify the area"
                    className="border border-gray-200 px-3 py-2 w-full rounded-lg text-sm focus-visible:outline-none focus-visible:border-slate-400 mt-2 transition-colors"
                    onChange={(e) => {
                      department === "Otro" && setOtro(e.target.value);
                    }}
                    value={otro || ""}
                  />
                )}
              </div>
            </ModalConfirmacion>
          )}
          {initialState.cotizado && (
            <ModalConfirmacion
              isLoading={modalLoader}
              hasComment={false}
              isOpen={initialState.cotizado}
              onCancel={() => handleState("cotizado", false)}
              text={
                <p>
                  Change status to <strong>QUOTED</strong>
                </p>
              }
              onSubmit={handleStatusCotizado}
            >
              <div>
                <p className="text-sm text-slate-600 text-center">
                  Are you sure you want to create a <strong>new quote</strong>{" "}
                  from this message's information?
                </p>
              </div>
            </ModalConfirmacion>
          )}
          {initialState.servicio && (
            <ModalConfirmacion
              isLoading={modalLoader}
              hasComment={false}
              isOpen={initialState.servicio}
              onCancel={() => handleState("servicio", false)}
              text={
                <p>
                  Change status to <strong>SERVICE</strong>
                </p>
              }
              onSubmit={handleStatusServicio}
              titleComment="Comment (optional)"
            >
              <div>
                <p className="text-sm text-slate-600 text-center">
                  Are you sure you want to move this message to{" "}
                  <strong>technical service</strong>?
                </p>
              </div>
            </ModalConfirmacion>
          )}
        </>
      )}
    </>
  );
};
