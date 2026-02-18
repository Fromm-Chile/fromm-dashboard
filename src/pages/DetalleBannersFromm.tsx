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
    refetchOnWindowFocus: false,
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
          <button
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-4 mb-4 cursor-pointer transition-colors"
            onClick={() => navigate("/banners")}
          >
            <img src="/icons/left-arrow.svg" width={14} height={14} />
            Volver
          </button>
          <div className="max-w-[1150px] mx-auto bg-white border border-gray-200 rounded-xl p-6">
            <h1 className="text-xl font-semibold text-slate-800 mb-5">
              Detalles Banner
            </h1>
            <div className="mb-6">
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg">
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1.5">
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Nombre:</span> {banner?.name}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Ultima modificación:</span>{" "}
                      {new Date(
                        banner?.updatedAt || ""
                      ).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>
                    <p className="text-sm text-slate-600">
                      <span className="font-medium">Url:</span> {banner?.url}
                    </p>
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
                          whiteButton
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
                <img
                  src={banner?.url}
                  className="rounded-lg border border-gray-200 w-full max-w-[900px] mx-auto"
                />
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
          <div className="flex items-center gap-3 mt-4 w-full mb-3">
            <label className="text-sm text-slate-600">Nueva posición</label>
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
