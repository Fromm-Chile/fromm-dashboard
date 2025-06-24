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
    <div className="h-[151px] w-full bg-white rounded-3xl shadow-md flex items-center justify-around p-4 mb-5">
      <div className="flex gap-5 items-center border-r-2 border-gray-200 pr-5">
        <img src="/images/inbox.svg" height={70} width={70} />
        <div>
          <p className="text-gray-500">{tituloTotal}</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>
      </div>
      <div className="flex gap-5 items-center border-r-2 border-gray-200 pr-5">
        <img src="/images/waiting.svg" height={70} width={70} />
        <div>
          <p className="text-gray-500">{tituloPendiente}</p>
          <p className="text-2xl font-bold">{pendiente}</p>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <img src="/images/sent.svg" height={70} width={70} />
        <div>
          <p className="text-gray-500">{tituloEnviada}</p>
          <p className="text-2xl font-bold">{enviada}</p>
        </div>
      </div>
    </div>
  );
};
