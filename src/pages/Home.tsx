export const Home = () => {
  return (
    <>
      <div className="py-8">
        <h1 className="text-2xl font-semibold text-slate-800 mb-2">
          Welcome!
        </h1>
        <p className="text-slate-500 text-sm mb-8">
          Fromm Dashboard (DEMO)
        </p>
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <p className="text-sm text-slate-600 leading-relaxed">
            This is the centralized system to manage quotes, contacts, and
            clients. Here you can access all the necessary tools to optimize
            your processes and improve your clients' experience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 p-5 rounded-xl hover:border-gray-300 transition-colors">
            <h2 className="text-sm font-semibold text-slate-700 mb-1">Quotes</h2>
            <p className="text-xs text-slate-400">Manage your clients' quotes.</p>
          </div>
          <div className="bg-white border border-gray-200 p-5 rounded-xl hover:border-gray-300 transition-colors">
            <h2 className="text-sm font-semibold text-slate-700 mb-1">
              Contacts
            </h2>
            <p className="text-xs text-slate-400">Manage your clients' contacts.</p>
          </div>
          <div className="bg-white border border-gray-200 p-5 rounded-xl hover:border-gray-300 transition-colors">
            <h2 className="text-sm font-semibold text-slate-700 mb-1">
              Clients
            </h2>
            <p className="text-xs text-slate-400">
              View and manage your clients' information.
            </p>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <img
          src="https://pub-873e7884cc3b416fa7c9d881d5d16822.r2.dev/fromm-cover.jpeg"
          alt="Dashboard Illustration"
          className="rounded-xl border border-gray-200"
          width={800}
          height={400}
        />
      </div>
    </>
  );
};
