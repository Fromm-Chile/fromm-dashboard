import { JSX, PropsWithChildren } from "react";
import { Loader } from "./Loader";
import { AlertTriangle } from "lucide-react";

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
  buttonText = "Accept",
  onSubmit,
  onCancel,
  isOpen,
  isLoading,
  children,
  titleComment = "Comment",
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
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
              <div className="flex flex-col justify-center h-auto w-[480px] overflow-y-auto overflow-x-hidden">
                <div className="bg-white rounded-xl w-full border border-gray-200 flex flex-col items-center justify-center min-h-[240px] py-6 px-6 shadow-lg">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <AlertTriangle size={20} className="text-amber-500" strokeWidth={1.75} />
                  </div>
                  <div className="text-sm text-slate-600 text-center mb-2">
                    {text}
                  </div>
                  {children}
                  {hasComment && (
                    <>
                      <div className="flex flex-col mt-4 w-full">
                        <label className="text-xs font-medium text-slate-500 mb-1.5">
                          {titleComment}
                        </label>
                        <textarea
                          onChange={(e) => setValue && setValue(e.target.value)}
                          className="border border-gray-200 px-3 py-2 w-full rounded-lg text-sm focus-visible:outline-none focus-visible:border-slate-400 focus-visible:ring-1 focus-visible:ring-slate-200 transition-colors"
                        />
                      </div>
                      {error && (
                        <p className="text-red-500 text-xs mt-1">{error}</p>
                      )}
                    </>
                  )}
                  <div className="flex gap-3 mt-5 w-full justify-end">
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={onCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 cursor-pointer transition-colors"
                      onClick={onSubmit}
                      disabled={isLoading}
                    >
                      {buttonText}
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
