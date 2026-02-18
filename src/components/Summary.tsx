type SummaryProps = {
  total: number;
  pendiente: number;
  enviada?: number | string;
  tituloTotal?: string;
  tituloPendiente?: string;
  tituloEnviada?: string;
};

export const Summary = ({
  total,
  pendiente,
  enviada,
  tituloTotal = "Total Quotes",
  tituloPendiente = "Pending Quotes",
  tituloEnviada = "Sent Quotes",
}: SummaryProps) => {
  return (
    <div className="w-full grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
          {tituloTotal}
        </p>
        <p className="text-2xl font-semibold text-slate-800">{total}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
          {tituloPendiente}
        </p>
        <p className="text-2xl font-semibold text-slate-800">{pendiente}</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
          {tituloEnviada}
        </p>
        <p className="text-2xl font-semibold text-slate-800">{enviada}</p>
      </div>
    </div>
  );
};
