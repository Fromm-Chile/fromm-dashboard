export const Loader = () => {
  return (
    <div className="flex justify-center items-center absolute top-0 left-0 w-full h-full z-50 bg-white/80 backdrop-blur-sm">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-solid border-slate-300 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};
