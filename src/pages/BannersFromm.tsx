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
          <div className="">
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
        <div className="">
          {getValue() ? (
            <span className="text-green-500">Sí</span>
          ) : (
            <span className="text-red-500">No</span>
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
    <>
      <div className="pb-10 pt-10">
        <div className="w-full h-auto bg-white rounded-3xl shadow-lg p-8 mb-12 text-gray-600">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-medium text-center">
              Banners promocionales de FROMM
            </h1>
            <button
              className="cursor-pointer hover:bg-red-400 bg-red-500 rounded-lg text-white p-4 hover:shadow-lg transition-all"
              onClick={() => {
                setModalUpload(true);
                setFile(null);
                setError(null);
              }}
            >
              SUBIR BANNER
            </button>
          </div>

          <Table
            datosTabla={banners}
            columns={columns}
            detailsRoute="banners"
            isLoading={isLoading}
          />
        </div>
      </div>
      {modalUpload && (
        <ModalConfirmacion
          isLoading={modalLoader}
          isOpen={modalUpload}
          onCancel={() => setModalUpload(false)}
          text={<p>Agregar imágen jpg con un tamaño máximo de 4 MB.</p>}
          onSubmit={uploadImageHandler}
          hasComment={false}
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
                          Arrastra &amp; suelta tu imágen aquí
                        </span>
                        <span className="block text-gray-400 font-normal mt-1">
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
              {/* {error && (
                <p className="text-red-400 font-bold text-base">{error}</p>
              )} */}
            </>
          )}
          <div className="flex items-center justify-between mt-5 w-[50%] mb-5">
            <label>Posición del banner</label>
            <input
              type="number"
              value={order || ""}
              onChange={(e) => setOrder(Number(e.target.value))}
              className="border border-gray-300 py-2 pl-5 rounded-md focus-visible:outline-none focus-visible:border-red-500 w-20"
            />
          </div>
          {error && <p className="text-red-400 font-bold text-base">{error}</p>}
        </ModalConfirmacion>
      )}
    </>
  );
};
