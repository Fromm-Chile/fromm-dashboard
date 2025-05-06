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
import { formatAsCLP, parseCurrency } from "../assets/helperFunctions";
import { useUserStore } from "../store/useUserStore";

export const DetalleCotizacion = () => {
  const [estatus, setEstatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [totalAmount, setTotalAmount] = useState<number | null>(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [initialState, handleState] = useModalStates({
    enviada: false,
    derivada: false,
    seguimiento: false,
    agregarSeguimiento: false,
    vendido: false,
    perdida: false,
  });

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
  });

  // console.log(cotizacion);
  const navigate = useNavigate();

  const handleClick = (value: string) => {
    console.log(value);
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
    } finally {
      handleState("enviada", false);
      navigate("/cotizaciones");
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
      navigate("/cotizaciones");
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
      navigate("/cotizaciones");
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
      navigate("/cotizaciones");
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
      navigate("/cotizaciones");
      setModalLoader(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mt-5 flex items-center gap-2 text-lg">
            <img src="/icons/left-arrow.svg" width={15} height={15} />
            <button
              className="cursor-pointer hover:text-red-600"
              onClick={() => navigate("/cotizaciones")}
            >
              Volver
            </button>
          </div>
          <h1 className="text-3xl font-bold text-red-500 pb-4 mt-2 mb-4">
            Detalle de Cotización
          </h1>
          <div className="w-full max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información General
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg flex justify-between items-center">
                <div className="flex flex-col pr-10">
                  <p className="text-gray-700">
                    <strong>Cotización #{cotizacion.id}</strong>
                  </p>
                  <p className="text-gray-700">
                    <strong>Fecha de creación:</strong>{" "}
                    {cotizacion.createdAt
                      ? new Date(cotizacion.createdAt).toLocaleDateString(
                          "es-ES"
                        )
                      : "No disponible"}
                  </p>
                  <p
                    className={`p-2 rounded-lg text-center w-fit text-white mt-2 ${
                      cotizacion.statusR.name === "PENDIENTE"
                        ? "bg-gray-400 "
                        : cotizacion.statusR.name === "ENVIADA"
                        ? "bg-green-400"
                        : cotizacion.statusR.name === "VENDIDO"
                        ? "bg-green-500"
                        : cotizacion.statusR.name === "SEGUIMIENTO"
                        ? "bg-yellow-500"
                        : cotizacion.statusR.name === "DERIVADA"
                        ? "bg-blue-600"
                        : cotizacion.statusR.name === "PERDIDA"
                        ? "bg-red-700"
                        : ""
                    }`}
                  >
                    <strong>{cotizacion.statusR.name}</strong>
                  </p>
                  {cotizacion.statusR.name === "VENDIDO" && (
                    <p className="text-gray-700 text-2xl">
                      <strong>Monto neto de la venta:</strong>{" "}
                      {formatAsCLP(cotizacion.totalAmount)}
                    </p>
                  )}
                </div>
                <div>
                  {user.roleId === 4 || user.roleId === 5 ? null : (
                    <SelectTable
                      selectOptions={
                        cotizacion.statusR.name === "PENDIENTE"
                          ? [
                              { value: "enviada", texto: "ENVIADA" },
                              { value: "derivada", texto: "DERIVADA" },
                            ]
                          : [
                              { value: "enviada", texto: "ENVIADA" },
                              { value: "seguimiento", texto: "SEGUIMIENTO" },
                              { value: "vendido", texto: "VENDIDO" },
                              { value: "perdida", texto: "PERDIDA" },
                            ]
                      }
                      label="Estado de la cotización"
                      onChange={(e) => {
                        setEstatus(e.target.value);
                        handleClick(e.target.value);
                      }}
                      value={estatus || cotizacion.statusR.id}
                    />
                  )}
                  {cotizacion.statusR.name === "PENDIENTE" ||
                  cotizacion.statusR.name === "DERIVADA" ? null : (
                    <div className="mt-2 flex gap-2 justify-center text-green-500 font-bold border border-gray-200 bg-white rounded-lg p-2 hover:bg-gray-100 hover:text-green-600">
                      <a target="_blank" href={cotizacion.invoiceURL}>
                        VER COTIZACIÓN
                      </a>
                      <img src="/icons/clip.svg" width={20} height={20} />
                    </div>
                  )}
                  {cotizacion.statusR.name === "SEGUIMIENTO" && (
                    <Button
                      className="w-fit h-[40px] flex items-center justify-center mt-2"
                      onClick={() => handleState("agregarSeguimiento", true)}
                      link=""
                      whiteButton
                    >
                      Agregar seguimiento
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Información del Usuario
              </h2>
              <div className="bg-gray-100 p-4 rounded-lg ">
                <div className="flex gap-20 mb-5">
                  <div>
                    <p className="text-gray-700">
                      <strong>Nombre:</strong>{" "}
                      {cotizacion.user?.name || "No disponible"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Email:</strong>{" "}
                      {cotizacion.user?.email || "No disponible"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Teléfono:</strong>{" "}
                      {cotizacion.user?.phone || "No registrado"}
                    </p>
                    <p className="text-gray-700">
                      <strong>Empresa:</strong>{" "}
                      {cotizacion.user?.company || "No registrada"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700">
                    <strong>Mensaje:</strong>{" "}
                    {cotizacion?.message || "Sin mensaje."}
                  </p>
                </div>
              </div>
            </div>
            {cotizacion.invoiceDetails?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  Detalles de la Solicitud
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-200 text-gray-700">
                      <tr>
                        <th className="px-4 py-2 text-left">Código</th>
                        <th className="px-4 py-2 text-left">Producto</th>
                        <th className="px-4 py-2 text-left">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotizacion.invoiceDetails?.map((detail: any) => (
                        <tr
                          key={detail.id}
                          className="border-t border-gray-200"
                        >
                          <td className="px-4 py-2">{detail.id}</td>
                          <td className="px-4 py-2">{detail.name}</td>
                          <td className="px-4 py-2">{detail.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2 mt-5">
                Historial solicitud
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-200 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Comentario</th>
                      <th className="px-4 py-2 text-left">Realizado por</th>
                      <th className="px-4 py-2 text-left">Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cotizacion?.invoiceEvents.map((event: any) => (
                      <tr key={event.id} className="border-t border-gray-200">
                        <td className="px-4 py-2">{event.status}</td>
                        <td className="px-4 py-2">
                          {event.comment || "Sin comentario"}
                        </td>
                        <td className="px-4 py-2">
                          {event.adminUser?.name || "Cliente"}
                        </td>
                        <td className="px-4 py-2">
                          {event.createdAt
                            ? new Date(event.createdAt).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                }
                              )
                            : "No disponible"}
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
              Cambar estado a <strong>ENVIADA</strong>
            </p>
          }
          onSubmit={handleStatusEnviada}
          titleComment="Comentario (opcional)"
        >
          {file ? (
            <div className="h-48 rounded-lg border-2 border-gray-300 bg-gray-50 flex flex-col justify-center px-3 mt-3 items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <p className="text-gray-700 mb-2">
                <strong>Archivo seleccionado:</strong>
              </p>
              <p>{file.name}</p>
              <button
                className="bg-red-500 text-white rounded-lg px-4 py-2 mt-4 cursor-pointer hover:bg-red-600"
                onClick={() => setFile(null)}
              >
                Cambiar archivo
              </button>
            </div>
          ) : (
            <>
              <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl">
                <div className="md:flex">
                  <div className="w-full p-3">
                    <div className="relative h-48 rounded-lg border-2 border-gray-300 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                      <div className="absolute flex flex-col items-center">
                        <img
                          alt="File Icon"
                          className="mb-3"
                          src="https://img.icons8.com/dusk/64/000000/file.png"
                        />
                        <span className="block text-gray-500 font-semibold">
                          Arrastra &amp; suelta tu cotización aquí
                        </span>
                        <span className="block text-gray-400 font-normal mt-1">
                          o haz click para subir
                        </span>
                      </div>
                      <input
                        name=""
                        className="h-full w-full opacity-0 cursor-pointer"
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          const maxSizeInBytes = 4 * 1024 * 1024;
                          if (file) {
                            if (file.size > maxSizeInBytes) {
                              alert("Documento no debe exceder los 4 MB!");
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
                <p className="text-red-400 font-bold text-base">{error}</p>
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
              Cambar estado a <strong>DERIVADA</strong>
            </p>
          }
          onSubmit={handleStatusDerivado}
          titleComment="Comentario (opcional)"
        >
          <div className="w-[80%] mx-auto mt-5">
            <p className="text-lg">
              ☑️ Derivar a <strong>Gerencia Comerial</strong>
            </p>
            {/* <SelectTable
              label="Selecciona el area"
              selectOptions={[{ value: "ventas", texto: "Gerencia Comercial" }]}
              onChange={(e) => console.log(e.target.value)}
              value=""
            /> */}
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
              Cambar estado a <strong>SEGUIMIENTO</strong>
            </p>
          }
          onSubmit={handleStatusSegumiento}
          titleComment="Ingresa los detalles del seguimiento*"
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
              Nuevo <strong>SEGUIMIENTO</strong>
            </p>
          }
          onSubmit={handleStatusSegumiento}
          titleComment="Ingresa los detalles del seguimiento*"
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
              Cambar estado a <strong>VENDIDO</strong>
            </p>
          }
          onSubmit={handleStatusVenta}
          titleComment="Comentario (opcional)"
        >
          <div className="flex flex-col items-center justify-center mt-5 w-[80%]">
            <label htmlFor="" className="self-start mb-1">
              Ingresa el monto neto de la venta.
            </label>
            <input
              type="text"
              className="border border-gray-300 p-2 w-[100%] rounded-md focus-visible:outline-none focus-visible:border-red-500"
              onChange={(e) => {
                const rawValue = parseCurrency(e.target.value); // Parse the formatted value back to a number
                setTotalAmount(rawValue); // Update the state with the raw number
              }}
              onBlur={(e) => {
                // Format the value when the input loses focus
                const rawValue = parseCurrency(e.target.value);
                e.target.value = formatAsCLP(rawValue) || "";
              }}
              value={totalAmount !== null ? formatAsCLP(totalAmount) : ""}
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
              Cambar estado a <strong>PERDIDA</strong>
            </p>
          }
          onSubmit={handleStatusPerdido}
          titleComment="Ingresa el motivo de la perdida*"
        ></ModalConfirmacion>
      )}
    </>
  );
};
