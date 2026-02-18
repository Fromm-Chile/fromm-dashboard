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
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const opcionesSelect = [
  { id: "PENDIENTE", texto: "PENDING", value: "PENDIENTE" },
  { id: "ENVIADA", texto: "SENT", value: "ENVIADA" },
  { id: "VENDIDO", texto: "SOLD", value: "VENDIDO" },
  { id: "SEGUIMIENTO", texto: "FOLLOW-UP", value: "SEGUIMIENTO" },
  { id: "DERIVADA", texto: "REFERRED", value: "DERIVADA" },
  { id: "PERDIDA", texto: "LOST", value: "PERDIDA" },
];

const statusStyle: Record<string, string> = {
  PENDIENTE: "bg-gray-100 text-gray-600",
  ENVIADA: "bg-emerald-50 text-emerald-700",
  VENDIDO: "bg-green-50 text-green-700",
  SEGUIMIENTO: "bg-amber-50 text-amber-700",
  DERIVADA: "bg-blue-50 text-blue-700",
  PERDIDA: "bg-red-50 text-red-700",
};

const statusLabel: Record<string, string> = {
  PENDIENTE: "PENDING",
  ENVIADA: "SENT",
  VENDIDO: "SOLD",
  SEGUIMIENTO: "FOLLOW-UP",
  DERIVADA: "REFERRED",
  PERDIDA: "LOST",
};

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
      refetchOnWindowFocus: false,
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
        const val = getValue();
        return (
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
              statusStyle[val] || ""
            }`}
          >
            {statusLabel[val] || val}
          </span>
        );
      },
    },
  ];

  return (
    <div className="pb-8">
      <Summary
        total={totalCount || 0}
        pendiente={pendingInvoices || 0}
        enviada={sendInvoices || 0}
      />
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="mb-5 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-slate-800">Quotes</h1>
          {user.roleId === 4 || user.roleId === 5 ? null : (
            <button
              className="cursor-pointer bg-slate-900 hover:bg-slate-800 rounded-lg text-white text-sm font-medium px-4 py-2.5 transition-colors"
              onClick={() => navigate("/nueva-cotizacion")}
            >
              Create Quote
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <div className="border border-gray-200 rounded-lg flex items-center flex-1 max-w-[400px]">
            <Search size={16} className="ml-3 text-slate-400" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg outline-none w-full text-sm"
            />
          </div>
          <SelectTable
            label="Filter by status"
            selectOptions={opcionesSelect}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
            value={filter || ""}
          />
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Show</span>
            <select
              className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-white"
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
            <span>records</span>
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
        <div className="flex items-center justify-end mt-5 gap-2">
          <button
            onClick={() =>
              setPage((prev) => (prev > 0 ? prev - 1 : prev))
            }
            disabled={page === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} strokeWidth={1.75} />
          </button>
          <span className="text-sm text-slate-500 px-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() =>
              setPage((prev) => (prev < totalPages ? prev + 1 : prev))
            }
            className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <ChevronRight size={16} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
};
