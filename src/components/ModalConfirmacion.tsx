import { JSX, PropsWithChildren } from "react";
import { Loader } from "./Loader";

type ModalConfirmacionProps = {
  text: string | JSX.Element;
  buttonText?: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
  isLoading?: boolean;
  titleComment?: string;
  hasComment?: boolean;
  setValue?: (value: string) => void;
  error?: string;
};

export const ModalConfirmacion = ({
  text,
  buttonText = "Aceptar",
  onSubmit,
  onCancel,
  isOpen,
  isLoading,
  children,
  titleComment = "Comentario",
  hasComment = true,
  setValue,
  error,
}: PropsWithChildren<ModalConfirmacionProps>) => {
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {isOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/30 bg-opacity-50 text-gray-600">
              <div className="flex flex-col justify-center h-auto w-[510px] overflow-y-auto overflow-x-hidden">
                <div className="bg-white rounded-lg h-full w-full border-2 border-red-900 flex flex-col items-center justify-center min-h-[274px] py-5">
                  <img src="/icons/alert.svg" width={70} className="mb-5" />
                  {text}
                  {children}
                  {hasComment && (
                    <>
                      <div className="flex flex-col items-center justify-center mt-5 w-[80%]">
                        <label htmlFor="" className="self-start mb-1">
                          {titleComment}
                        </label>
                        <textarea
                          onChange={(e) => setValue && setValue(e.target.value)}
                          className="border border-gray-300 p-2 w-[100%] rounded-md focus-visible:outline-none focus-visible:border-red-500"
                        />
                      </div>
                      <p className="text-red-400 font-bold text-base">
                        {error}
                      </p>
                    </>
                  )}
                  <div className="flex gap-5">
                    <button
                      className="bg-red-500 text-white rounded-lg px-4 py-2 mt-4 cursor-pointer hover:bg-red-600"
                      onClick={onSubmit}
                      disabled={isLoading}
                    >
                      {buttonText}
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 rounded-lg px-4 py-2 mt-4 cursor-pointer hover:bg-gray-400"
                      onClick={onCancel}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};
