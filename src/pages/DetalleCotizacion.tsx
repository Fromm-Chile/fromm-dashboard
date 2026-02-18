import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components/Loader";
import { useEffect, useState } from "react";
import { SelectTable } from "../components/SelectTable";
import { useModalStates } from "../hooks/useModalStates";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { Button } from "../components/Button";
import { formatAsUSD } from "../assets/helperFunctions";
import { useUserStore } from "../store/useUserStore";

const statusStyle: Record<string, string> = {
  PENDIENTE: "bg-gray-100 text-gray-600",
  ENVIADA: "bg-emerald-50 text-emerald-700",
  VENDIDO: "bg-green-50 text-green-700",
  SEGUIMIENTO: "bg-amber-50 text-amber-700",
  DERIVADA: "bg-blue-50 text-blue-700",
  PERDIDA: "bg-red-50 text-red-700",
};

export const DetalleCotizacion = () => {
  const [estatus, setEstatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [initialState, handleState] = useModalStates(
    {
      enviada: false,
      derivada: false,
      seguimiento: false,
      agregarSeguimiento: false,
      vendido: false,
      perdida: false,
    },
    (_, isOpen) => {
      if (!isOpen) {
        setEstatus(null);
      }
    }
  );

  const { user = {} } = useUserStore();

  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setError(null);
  }, [comment]);

  const { data: cotizacion = {}, isLoading } = useQuery({
    queryKey: ["cotizacion", id],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/admin/invoices/${id}`, {
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
    handleState(value, true);
  };

  const handleStatusEnviada = async () => {
    if (!file) {
      setError("Debes adjuntar la cotización para continuar!");
      return;
    }
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/invoices/upload`,
        { file, id, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 413) {
          alert(error.response?.data.message || "");
        }
      }
    } finally {
      handleState("enviada", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  const handleStatusSegumiento = async () => {
    if (!comment) {
      setError("El comentario del seguimiento es requerido!");
      return;
    }
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/invoices/seguimiento`,
        { id, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("enviada", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  const handleStatusVenta = async () => {
    if (!totalAmount) {
      setError("El monto de la venta es requerido!");
      return;
    }
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/invoices/vendido`,
        { id, comment, totalAmount },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("vendido", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  const handleStatusDerivado = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/invoices/derivado`,
        { id, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("derivada", false);
      navigate(-1);
      setModalLoader(false);
    }
  };

  const handleStatusPerdido = async () => {
    if (!comment) {
      setError("El motivo de la perdida es requerido!");
      return;
    }
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/admin/invoices/perdido`,
        { id, comment },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleState("perdida", false);
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
            Quote Details
          </h1>
          <div className="w-full max-w-[1150px] mx-auto bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                General Information
              </h2>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg flex justify-between items-start">
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Quote #{cotizacion.id}</span>
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-medium">Creation date:</span>{" "}
                    {cotizacion.createdAt
                      ? new Date(cotizacion.createdAt).toLocaleDateString("en-US")
                      : "Not available"}
                  </p>
                  <span
                    className={`inline-block w-fit px-2.5 py-1 rounded-full text-xs font-medium mt-1 ${
                      statusStyle[cotizacion.statusR.name] || ""
                    }`}
                  >
                    {cotizacion.statusR.name}
                  </span>
                  {cotizacion.statusR.name === "VENDIDO" && (
                    <p className="text-lg text-slate-800 font-semibold mt-2">
                      Net sale: USD {formatAsUSD(cotizacion.totalAmount)}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  {user.roleId === 4 || user.roleId === 5 ? null : (
                    <SelectTable
                      selectOptions={
                        cotizacion.statusR.name === "PENDIENTE"
                          ? [
                              { value: "enviada", texto: "SENT" },
                              { value: "derivada", texto: "REFERRED" },
                            ]
                          : [
                              { value: "enviada", texto: "SENT" },
                              { value: "seguimiento", texto: "FOLLOW-UP" },
                              { value: "vendido", texto: "SOLD" },
                              { value: "perdida", texto: "LOST" },
                            ]
                      }
                      label="Quote status"
                      onChange={(e) => {
                        setEstatus(e.target.value);
                        handleClick(e.target.value);
                      }}
                      value={estatus || ""}
                    />
                  )}
                  {cotizacion.statusR.name === "PENDIENTE" ||
                  cotizacion.statusR.name === "DERIVADA" ? null : (
                    <a
                      target="_blank"
                      href={cotizacion.invoiceURL}
                      className="flex items-center gap-2 justify-center text-sm font-medium text-emerald-600 border border-gray-200 bg-white rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                    >
                      View Quote
                      <img src="/icons/clip.svg" width={16} height={16} />
                    </a>
                  )}
                  {cotizacion.statusR.name === "SEGUIMIENTO" && (
                    <Button
                      className="text-sm"
                      onClick={() => handleState("agregarSeguimiento", true)}
                      link=""
                      whiteButton
                    >
                      Add follow-up
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                User Information
              </h2>
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Name:</span>{" "}
                      {cotizacion.user?.name || "Not available"}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Email:</span>{" "}
                      {cotizacion.user?.email || "Not available"}
                    </p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Phone:</span>{" "}
                      {cotizacion.user?.phone || "Not registered"}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Company:</span>{" "}
                      {cotizacion.user?.company || "Not registered"}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  <span className="font-medium">Message:</span>{" "}
                  {cotizacion?.message || "No message."}
                </p>
              </div>
            </div>
            {cotizacion.invoiceDetails?.length > 0 && (
              <div className="mb-6">
                <h2 className="text-sm font-semibold text-slate-700 mb-3">
                  Request Details
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Code</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Product</th>
                        <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotizacion.invoiceDetails?.map((detail: any) => (
                        <tr
                          key={detail.id}
                          className="border-b border-gray-100"
                        >
                          <td className="px-4 py-2.5 text-sm text-slate-600">{detail.id}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">{detail.name}</td>
                          <td className="px-4 py-2.5 text-sm text-slate-600">{detail.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-slate-700 mb-3">
                Request History
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Comment</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Performed by</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotizacion?.invoiceEvents.map((event: any) => (
                      <tr key={event.id} className="border-b border-gray-100">
                        <td className="px-4 py-2.5 text-sm text-slate-600">{event.status}</td>
                        <td className="px-4 py-2.5 text-sm text-slate-600">
                          {event.comment || "No comment"}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-slate-600">
                          {event.adminUser?.name || "Client"}
                        </td>
                        <td className="px-4 py-2.5 text-sm text-slate-600">
                          {event.createdAt
                            ? new Date(event.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "Not available"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
      {initialState.enviada && (
        <ModalConfirmacion
          isLoading={modalLoader}
          setValue={setComment}
          isOpen={initialState.enviada}
          onCancel={() => handleState("enviada", false)}
          text={
            <p>
              Change status to <strong>SENT</strong>
            </p>
          }
          onSubmit={handleStatusEnviada}
          titleComment="Comment (optional)"
        >
          {file ? (
            <div className="h-40 rounded-lg border border-gray-200 bg-gray-50 flex flex-col justify-center px-3 mt-3 items-center">
              <p className="text-sm text-slate-600 mb-2">
                <strong>Selected file:</strong>
              </p>
              <p className="text-sm text-slate-500">{file.name}</p>
              <button
                className="bg-slate-900 text-white rounded-lg px-3 py-1.5 mt-3 cursor-pointer hover:bg-slate-800 text-sm transition-colors"
                onClick={() => setFile(null)}
              >
                Change file
              </button>
            </div>
          ) : (
            <>
              <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
                <div className="md:flex">
                  <div className="w-full p-3">
                    <div className="relative h-40 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex justify-center items-center hover:border-gray-400 transition-colors">
                      <div className="absolute flex flex-col items-center">
                        <img
                          alt="File Icon"
                          className="mb-2 opacity-50"
                          src="https://img.icons8.com/dusk/64/000000/file.png"
                          width={40}
                        />
                        <span className="block text-slate-500 text-sm font-medium">
                          Drag &amp; drop your quote here
                        </span>
                        <span className="block text-slate-400 text-xs mt-1">
                          or click to upload
                        </span>
                      </div>
                      <input
                        name=""
                        className="h-full w-full opacity-0 cursor-pointer"
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.bmp,.webp,image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          const maxSizeInBytes = 4 * 1024 * 1024;
                          if (file) {
                            if (file.size > maxSizeInBytes) {
                              alert("Document must not exceed 4 MB!");
                              e.target.value = "";
                            } else {
                              setFile(file);
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {error && (
                <p className="text-red-500 text-xs mt-1">{error}</p>
              )}
            </>
          )}
        </ModalConfirmacion>
      )}
      {initialState.derivada && (
        <ModalConfirmacion
          isLoading={modalLoader}
          setValue={setComment}
          isOpen={initialState.derivada}
          onCancel={() => handleState("derivada", false)}
          text={
            <p>
              Change status to <strong>FORWARDED</strong>
            </p>
          }
          onSubmit={handleStatusDerivado}
          titleComment="Comment (optional)"
        >
          <div className="w-[80%] mx-auto mt-4">
            <p className="text-sm text-slate-600">
              Forward to <strong>Sales Management</strong>
            </p>
          </div>
        </ModalConfirmacion>
      )}
      {initialState.seguimiento && (
        <ModalConfirmacion
          isLoading={modalLoader}
          setValue={setComment}
          isOpen={initialState.seguimiento}
          onCancel={() => handleState("seguimiento", false)}
          text={
            <p>
              Change status to <strong>FOLLOW-UP</strong>
            </p>
          }
          onSubmit={handleStatusSegumiento}
          titleComment="Enter follow-up details*"
        ></ModalConfirmacion>
      )}
      {initialState.agregarSeguimiento && (
        <ModalConfirmacion
          isLoading={modalLoader}
          setValue={setComment}
          isOpen={initialState.agregarSeguimiento}
          onCancel={() => handleState("agregarSeguimiento", false)}
          text={
            <p>
              New <strong>FOLLOW-UP</strong>
            </p>
          }
          onSubmit={handleStatusSegumiento}
          titleComment="Enter follow-up details*"
        ></ModalConfirmacion>
      )}
      {initialState.vendido && (
        <ModalConfirmacion
          isLoading={modalLoader}
          setValue={setComment}
          isOpen={initialState.vendido}
          onCancel={() => handleState("vendido", false)}
          text={
            <p>
              Change status to <strong>SOLD</strong>
            </p>
          }
          onSubmit={handleStatusVenta}
          titleComment="Comment (optional)"
        >
          <div className="flex flex-col mt-4 w-full">
            <label className="text-xs font-medium text-slate-500 mb-1.5">
              Enter the net sale amount in <strong>US dollars (USD)</strong>.
            </label>
            <input
              type="number"
              className="border border-gray-200 px-3 py-2 w-full rounded-lg text-sm focus-visible:outline-none focus-visible:border-slate-400 transition-colors"
              onChange={(e) => {
                setTotalAmount(Number(e.target.value));
              }}
              value={totalAmount || ""}
            />
          </div>
        </ModalConfirmacion>
      )}
      {initialState.perdida && (
        <ModalConfirmacion
          error={error || ""}
          isLoading={modalLoader}
          setValue={setComment}
          isOpen={initialState.perdida}
          onCancel={() => handleState("perdida", false)}
          text={
            <p>
              Change status to <strong>LOST</strong>
            </p>
          }
          onSubmit={handleStatusPerdido}
          titleComment="Enter the reason for the loss*"
        ></ModalConfirmacion>
      )}
    </>
  );
};
