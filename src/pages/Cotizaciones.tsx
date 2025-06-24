import { Summary } from "../components/Summary";
import { Table } from "../components/Table";
import { useQuery } from "@tanstack/react-query";
import { apiUrl } from "../assets/variables";
import axios, { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { useUserStore } from "../store/useUserStore";
import { SelectTable } from "../components/SelectTable";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";

const opcionesSelect = [
  { id: "PENDIENTE", texto: "PENDING", value: "PENDIENTE" },
  { id: "ENVIADA", texto: "SENT", value: "ENVIADA" },
  { id: "VENDIDO", texto: "SOLD", value: "VENDIDO" },
  { id: "SEGUIMIENTO", texto: "FOLLOW-UP", value: "SEGUIMIENTO" },
  { id: "DERIVADA", texto: "REFERRED", value: "DERIVADA" },
  { id: "PERDIDA", texto: "LOST", value: "PERDIDA" },
];

export const Cotizaciones = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const querylimit = searchParams.get("limit");
  const [limit, setLimit] = useState<number>(Number(querylimit) || 10);
  const [columnOrder, setColumnOrder] = useState(false);
  const query = searchParams.get("page");
  const [page, setPage] = useState<number>(Number(query) || 1);
  const navigate = useNavigate();
  const { countryCode, user = {} } = useUserStore();

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    if (filter) {
      const selectedOption = opcionesSelect.find(
        (option) => option.value === filter
      );
      if (selectedOption) {
        setFilter(selectedOption.value as string);
      }
    } else {
      setFilter(null);
    }
  }, [filter]);

  useEffect(() => {
    setSearchParams({ page: page.toString(), limit: limit.toString() });
  }, [page, limit, setSearchParams]);

  const {
    data: { cotizaciones = [], totalCount: totalPages = 1 } = {},
    isLoading,
  } = useQuery({
    queryKey: [
      "cotizaciones",
      debouncedSearch,
      filter,
      limit,
      page - 1,
      columnOrder,
    ],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/admin/invoices`, {
          params: {
            countryCode,
            name: debouncedSearch,
            status: filter,
            limit: Number(limit),
            page: page - 1,
            idOrder: columnOrder ? "asc" : "desc",
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        return data;
      } catch (error) {
        if (error instanceof AxiosError && error.status === 401) {
          navigate("/login");
        } else {
          console.error("Unexpected error:", error);
        }
        return [];
      }
    },
    refetchOnWindowFocus: false,
  });

  const { data: { totalCount, pendingInvoices, sendInvoices } = {} } = useQuery(
    {
      queryKey: ["datos", countryCode],
      queryFn: async () => {
        try {
          const { data } = await axios.get(
            `${apiUrl}/admin/invoices/datos/numeros`,
            {
              params: { countryCode },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            }
          );
          return data;
        } catch (error) {
          if (error instanceof AxiosError && error.status === 401) {
            navigate("/login");
          } else {
            console.error("Unexpected error:", error);
          }
          return [];
        }
      },
      staleTime: 5 * 60 * 1000,
    }
  );

  const columns = [
    {
      header: "No.",
      accessorKey: "id",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">{getValue()}</div>
      ),
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Company",
      accessorKey: "company",
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ getValue }: { getValue: () => any }) => {
        const date = new Date(getValue());
        return date.toLocaleDateString("en-US", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ getValue }: { getValue: () => any }) => {
        return (
          <div
            className={`p-2 rounded-lg text-center text-white ${
              getValue() === "PENDIENTE"
                ? "bg-gray-300"
                : getValue() === "ENVIADA"
                ? "bg-green-400"
                : getValue() === "VENDIDO"
                ? "bg-green-500"
                : getValue() === "SEGUIMIENTO"
                ? "bg-yellow-500"
                : getValue() === "DERIVADA"
                ? "bg-blue-600"
                : getValue() === "PERDIDA"
                ? "bg-red-700"
                : ""
            }`}
          >
            {getValue() === "PENDIENTE"
              ? "PENDING"
              : getValue() === "ENVIADA"
              ? "SENT"
              : getValue() === "VENDIDO"
              ? "SOLD"
              : getValue() === "SEGUIMIENTO"
              ? "FOLLOW-UP"
              : getValue() === "DERIVADA"
              ? "REFERRED"
              : getValue() === "PERDIDA"
              ? "LOST"
              : ""}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="pb-10">
        <Summary
          total={totalCount || 0}
          pendiente={pendingInvoices || 0}
          enviada={sendInvoices || 0}
        />
        <div className="w-full h-auto bg-white rounded-3xl shadow-lg p-8 mb-12 text-gray-600">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-medium text-center">Quotes</h1>
            {user.roleId === 4 || user.roleId === 5 ? null : (
              <button
                className="cursor-pointer hover:bg-red-400 bg-red-500 rounded-lg text-white p-4 hover:shadow-lg transition-all"
                onClick={() => navigate("/nueva-cotizacion")}
              >
                CREATE QUOTE
              </button>
            )}
          </div>
          <div className="flex items-center justify-around mb-4">
            <div className="border-2 border-gray-200 rounded-lg flex gap-1 items-center w-[450px]">
              <img
                src="/icons/search.svg"
                height={20}
                width={20}
                className="ml-2"
              />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded-lg outline-none w-[450px]"
              />
            </div>
            <div className="flex justify-end pb-6">
              <SelectTable
                label="Filter by status"
                selectOptions={opcionesSelect}
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
                value={filter || ""}
              />
            </div>
            <div className="border-2 border-gray-200 rounded-lg p-2 flex gap-5 items-center">
              <p>Show</p>
              <select
                className="select-registros"
                value={limit || ""}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                }}
              >
                {[10, 25, 50, 100].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
              <p>records</p>
            </div>
          </div>
          <Table
            datosTabla={cotizaciones}
            columns={columns}
            hasButton
            detailsRoute="cotizaciones"
            handlerColumnFilter={() => {
              setColumnOrder((prev) => !prev);
            }}
            isLoading={isLoading}
          />
          <div className="flex gap-5 items-center justify-end mt-8">
            <div className="border-2 border-gray-200 rounded-lg flex gap-5 items-center">
              <div className="flex gap-5 items-center p-2 hover:bg-gray-200">
                <button
                  onClick={() =>
                    setPage((prev) => (prev > 0 ? prev - 1 : prev))
                  }
                  disabled={page === 1}
                  className="cursor-pointer"
                >
                  <img src="/icons/left-arrow.svg" height={20} width={20} />
                </button>
              </div>
              <div>
                <p>
                  Page {page} of {totalPages}
                </p>
              </div>
              <div className="flex gap-5 items-center p-2 hover:bg-gray-200">
                <button
                  onClick={() =>
                    setPage((prev) => (prev < totalPages ? prev + 1 : prev))
                  }
                  className="cursor-pointer"
                >
                  <img
                    src="/icons/right-arrow-black.svg"
                    height={20}
                    width={20}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
