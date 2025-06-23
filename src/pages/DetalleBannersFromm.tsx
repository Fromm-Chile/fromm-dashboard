import { apiUrl } from "../assets/variables";
import { Button } from "../components/Button";
import { Loader } from "../components/Loader";
import { ModalConfirmacion } from "../components/ModalConfirmacion";
import { useModalStates } from "../hooks/useModalStates";
import { Banner } from "../types/bannersTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

export const DetalleBannersFromm = () => {
  const [initialState, handleState] = useModalStates({
    editar: false,
    eliminar: false,
    activar: false,
  });
  const [modalLoader, setModalLoader] = useState(false);
  const [order, setOrder] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setError(null);
  }, [order]);

  const { data: banner, isLoading } = useQuery({
    queryKey: ["banner", id],
    queryFn: async (): Promise<Banner> => {
      const { data } = await axios.get(`${apiUrl}/banners/${id}`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const changeOrderHandler = async () => {
    if (!order) {
      setError("La posición es requerida");
      return;
    }
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/banners/order`,
        { id, order },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
      handleState("editar", false);
      navigate("/banners");
      setModalLoader(false);
    }
  };

  const deleteBannerHandler = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/banners/remove`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
      handleState("eliminar", false);
      navigate("/banners");
      setModalLoader(false);
    }
  };

  const activateBannerHandler = async () => {
    try {
      setModalLoader(true);
      await axios.put(
        `${apiUrl}/banners/activate`,
        { id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
      handleState("activar", false);
      navigate("/banners");
      setModalLoader(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="mt-5 mb-5 flex items-center gap-2 text-lg pb-2">
            <img src="/icons/left-arrow.svg" width={15} height={15} />
            <button
              className="cursor-pointer hover:text-red-600"
              onClick={() => navigate("/banners")}
            >
              Volver
            </button>
          </div>
          <div className="max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-3xl font-bold text-red-500 pb-4 mt-2 mb-4">
              Detalles Banner
            </h1>
            <div className="mb-6">
              <div className="bg-gray-100 p-4 rounded-lg flex justify-center">
                <div className="flex gap-10 flex-col">
                  <div className="flex gap-10 justify-around">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-5">
                        <div>
                          <p className="text-gray-700">
                            <strong>Nombre:</strong> {banner?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-700">
                            <strong>Ultima modificación:</strong>{" "}
                            {new Date(
                              banner?.updatedAt || ""
                            ).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700">
                          <strong>Url:</strong> {banner?.url}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {banner?.isActive ? (
                        <>
                          <Button
                            link=""
                            onClick={() => handleState("editar", true)}
                          >
                            Cambiar posición
                          </Button>
                          <Button
                            link=""
                            onClick={() => handleState("eliminar", true)}
                          >
                            Eliminar
                          </Button>
                        </>
                      ) : (
                        <Button
                          link=""
                          onClick={() => handleState("activar", true)}
                        >
                          Habilitar
                        </Button>
                      )}
                    </div>
                  </div>
                  <img src={banner?.url} height={600} width={900} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {initialState.editar && (
        <ModalConfirmacion
          isLoading={modalLoader}
          isOpen={initialState.editar}
          onCancel={() => handleState("editar", false)}
          text={
            <p>
              Cambar la posición del <strong>banner</strong>
            </p>
          }
          onSubmit={changeOrderHandler}
          hasComment={false}
        >
          <div className="flex items-center justify-between mt-5 w-[40%] mb-5">
            <label>Nueva posición</label>
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
      {initialState.eliminar && (
        <ModalConfirmacion
          error={error || ""}
          isLoading={modalLoader}
          isOpen={initialState.eliminar}
          onCancel={() => handleState("eliminar", false)}
          text={
            <p>
              Estas seguro de eliminar este <strong>banner</strong>?
            </p>
          }
          onSubmit={deleteBannerHandler}
          hasComment={false}
        ></ModalConfirmacion>
      )}
      {initialState.activar && (
        <ModalConfirmacion
          error={error || ""}
          isLoading={modalLoader}
          isOpen={initialState.activar}
          onCancel={() => handleState("activar", false)}
          text={
            <p>
              Estas seguro de activar este <strong>banner</strong>?
            </p>
          }
          onSubmit={activateBannerHandler}
          hasComment={false}
        ></ModalConfirmacion>
      )}
    </>
  );
};
