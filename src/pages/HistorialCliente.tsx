import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import { apiUrl } from "../assets/variables";
import { useUserStore } from "../store/useUserStore";
import { Loader } from "../components/Loader";

export const HistorialCliente = () => {
  const { countryCode } = useUserStore();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: { invoices = [], contacts = [] } = {}, isLoading } = useQuery({
    queryKey: ["userInvoices", id, countryCode],
    queryFn: async () => {
      const { data } = await axios.get(`${apiUrl}/admin/invoices/user/${id}`, {
        params: { countryCode },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      {isLoading && <Loader />}
      <button
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mt-4 mb-4 cursor-pointer transition-colors"
        onClick={() => navigate(-1)}
      >
        <img src="/icons/left-arrow.svg" width={14} height={14} />
        Go back
      </button>
      <div className="max-w-[1150px] mx-auto bg-white border border-gray-200 rounded-xl p-6">
        <h1 className="text-xl font-semibold text-slate-800 mb-5">
          Client History
        </h1>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-slate-700 mb-3">
            User Information
          </h2>
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg">
            <div className="grid grid-cols-2 gap-x-12 gap-y-1.5">
              <p className="text-sm text-slate-600">
                <span className="font-medium">Name:</span>{" "}
                {invoices[0]?.user.name ||
                  contacts[0]?.name ||
                  "Not available"}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Phone:</span>{" "}
                {invoices[0]?.user.phone ||
                  contacts[0]?.phone ||
                  "Not registered"}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Email:</span>{" "}
                {invoices[0]?.user.email ||
                  contacts[0]?.email ||
                  "Not available"}
              </p>
              <p className="text-sm text-slate-600">
                <span className="font-medium">Company:</span>{" "}
                {invoices[0]?.user.company ||
                  contacts[0]?.company ||
                  "Not available"}
              </p>
            </div>
          </div>
        </div>
        {invoices.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Quotes History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">#Quote</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Comment</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Amount</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices?.map((invoice: any) => (
                    <tr key={invoice.id} className="border-b border-gray-100">
                      <td className="px-4 py-2.5 text-sm text-slate-600">{invoice.id}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">{invoice.statusR.name}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">
                        {invoice.invoiceEvents[0]?.comment}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(invoice.totalAmount || 0)}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">
                        {invoice.updatedAt
                          ? new Date(invoice.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "Not available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {contacts.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-slate-700 mb-3">
              Messages History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">ID</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Message</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts?.map((message: any) => (
                    <tr key={message.id} className="border-b border-gray-100">
                      <td className="px-4 py-2.5 text-sm text-slate-600">{message.id}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">{message.message}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">{message.status.name}</td>
                      <td className="px-4 py-2.5 text-sm text-slate-600">
                        {message.updatedAt
                          ? new Date(message.updatedAt).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                          : "Not available"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
