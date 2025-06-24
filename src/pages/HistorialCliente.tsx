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
      <div className="mt-5 mb-5 flex items-center gap-2 text-lg pb-2">
        <img src="/icons/left-arrow.svg" width={15} height={15} />
        <button
          className="cursor-pointer hover:text-red-600"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
      <div className="max-w-[1150px] mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-red-500 pb-4 mt-2 mb-4">
          Client History
        </h1>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            User Information
          </h2>
          <div className="bg-gray-100 p-4 rounded-lg ">
            <div className="flex gap-20 mb-5">
              <div>
                <p className="text-gray-700">
                  <strong>Name:</strong>{" "}
                  {invoices[0]?.user.name ||
                    contacts[0]?.name ||
                    "Not available"}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong>{" "}
                  {invoices[0]?.user.email ||
                    contacts[0]?.email ||
                    "Not available"}
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Phone:</strong>{" "}
                  {invoices[0]?.user.phone ||
                    contacts[0]?.phone ||
                    "Not registered"}
                </p>
                <p className="text-gray-700">
                  <strong>Company:</strong>{" "}
                  {invoices[0]?.user.company ||
                    contacts[0]?.company ||
                    "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>
        {invoices.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Quotes History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">#Quote</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Comment</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices?.map((invoice: any) => (
                    <tr key={invoice.id} className="border-t border-gray-200">
                      <td className="px-4 py-2">{invoice.id}</td>
                      <td className="px-4 py-2">{invoice.statusR.name}</td>
                      <td className="px-4 py-2">
                        {invoice.invoiceEvents[0]?.comment}
                      </td>
                      <td className="px-4 py-2">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(invoice.totalAmount || 0)}
                      </td>
                      <td className="px-4 py-2">
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
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Messages History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Message</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts?.map((message: any) => (
                    <tr key={message.id} className="border-t border-gray-200">
                      <td className="px-4 py-2">{message.id}</td>
                      <td className="px-4 py-2">{message.message}</td>
                      <td className="px-4 py-2">{message.status.name}</td>
                      <td className="px-4 py-2">
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
