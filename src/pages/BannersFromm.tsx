import { apiUrl } from "../assets/variables";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { Table } from "../components/Table";
import { Banner } from "../types/bannersTypes";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const BannersFromm = () => {
  const [modalUpload, setModalUpload] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [modalLoader, setModalLoader] = useState(false);
  const [order, setOrder] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
  }, [order]);

  const {
    data: banners = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["bannersFromm"],
    queryFn: async (): Promise<Banner[]> => {
      try {
        const { data } = await axios.get(`${apiUrl}/banners`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        return data;
      } catch (error) {
        if (error instanceof AxiosError && error.status === 401) {
          navigate("/login");
        } else {
          console.error("Unexpected error:", error);
        }
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  const columns = [
    {
      header: "Fecha de creación",
      accessorKey: "createdAt",
      cell: ({ getValue }: { getValue: () => any }) => {
        const date = new Date(getValue());
        return (
          <div>
            {date.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </div>
        );
      },
    },
    {
      header: "Nombre Imágen",
      accessorKey: "name",
    },
    {
      header: "Posición",
      accessorKey: "order",
    },
    {
      header: "Activa",
      accessorKey: "isActive",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div>
          {getValue() ? (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              Sí
            </span>
          ) : (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
              No
            </span>
          )}
        </div>
      ),
    },
  ];

  const uploadImageHandler = async () => {
    if (!file) {
      setError("Por favor, selecciona un archivo antes de continuar.");
      return;
    }
    if (!order) {
      setError("Por favor, ingresa la posición del banner.");
      return;
    }
    const positionExists = banners.some(
      (banner) => banner.order === order && banner.isActive
    );
    if (positionExists) {
      setError("Ya existe un banner activo en esta posición.");
      return;
    }
    try {
      setModalLoader(true);
      await axios.post(
        `${apiUrl}/files/upload`,
        { file, order },
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
      setModalUpload(false);
      navigate("/banners");
      refetch();
      setModalLoader(false);
    }
  };

  console.log(file);

  return (
    <div className="pb-8 pt-6">
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="mb-5 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-slate-800">
            Banners promocionales de FROMM
          </h1>
          <button
            className="cursor-pointer bg-slate-900 hover:bg-slate-800 rounded-lg text-white text-sm font-medium px-4 py-2.5 transition-colors"
            onClick={() => {
              setModalUpload(true);
              setFile(null);
              setError(null);
            }}
          >
            Subir Banner
          </button>
        </div>

        <Table
          datosTabla={banners}
          columns={columns}
          detailsRoute="banners"
          isLoading={isLoading}
        />
      </div>
      {modalUpload && (
        <ModalConfirmacion
          isLoading={modalLoader}
          isOpen={modalUpload}
          onCancel={() => setModalUpload(false)}
          text={<p className="text-sm">Agregar imágen jpg con un tamaño máximo de 4 MB.</p>}
          onSubmit={uploadImageHandler}
          hasComment={false}
        >
          {file ? (
            <div className="h-40 rounded-lg border border-gray-200 bg-gray-50 flex flex-col justify-center px-3 mt-3 items-center">
              <p className="text-sm text-slate-600 mb-2">
                <strong>Archivo seleccionado:</strong>
              </p>
              <p className="text-sm text-slate-500">{file.name}</p>
              <button
                className="bg-slate-900 text-white rounded-lg px-3 py-1.5 mt-3 cursor-pointer hover:bg-slate-800 text-sm transition-colors"
                onClick={() => setFile(null)}
              >
                Cambiar archivo
              </button>
            </div>
          ) : (
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
                        Arrastra &amp; suelta tu imágen aquí
                      </span>
                      <span className="block text-slate-400 text-xs mt-1">
                        o haz click para subir
                      </span>
                    </div>
                    <input
                      name=""
                      className="h-full w-full opacity-0 cursor-pointer"
                      type="file"
                      accept=".jpg,.jpeg"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        const maxSizeInBytes = 4 * 1024 * 1024;
                        if (file) {
                          if (file.size > maxSizeInBytes) {
                            alert("Imágen debe exceder los 4 MB!");
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
          )}
          <div className="flex items-center gap-3 mt-4 w-full mb-3">
            <label className="text-sm text-slate-600">Posición del banner</label>
            <input
              type="number"
              value={order || ""}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="border border-gray-200 py-2 pl-3 rounded-lg text-sm focus-visible:outline-none focus-visible:border-slate-400 w-20 transition-colors"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
        </ModalConfirmacion>
      )}
    </div>
  );
};
