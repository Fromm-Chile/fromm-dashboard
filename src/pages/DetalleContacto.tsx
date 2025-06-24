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
    staleTime: 5 * 60 * 1000,
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
            Contact Details
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
                    <p
                      className={`p-2 rounded-lg text-center w-fit text-white mt-2 ${
                        contacto.status.name === "PENDIENTE"
                          ? "bg-gray-400 "
                          : contacto.status.name === "COTIZACIÓN"
                          ? "bg-green-400"
                          : contacto.status.name === "DERIVADA"
                          ? "bg-blue-600"
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
                    <SelectTable
                      selectOptions={[
                        { value: "cotizado", texto: "QUOTED" },
                        { value: "servicio", texto: "SERVICE" },
                        { value: "derivada", texto: "REFERRED" }, // changed from "FORWARDED" to "REFERRED"
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
              <div className="w-[80%] mx-auto mt-5 mb-2">
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
                    className="border border-gray-300 p-2 w-full rounded-md focus-visible:outline-none focus-visible:border-red-500 mt-2"
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
                <p className="text-gray-700 text-center">
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
                <p className="text-gray-700 text-center">
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
