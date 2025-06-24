import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { Summary } from "../components/Summary";
import { useUserStore } from "../store/useUserStore";
import { SelectTable } from "../components/SelectTable";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import useDebounce from "../hooks/useDebounce";

const opcionesSelect = [
  { id: "PENDIENTE", texto: "PENDING", value: "PENDIENTE" },
  { id: "FINALIZADO", texto: "COMPLETED", value: "FINALIZADO" },
];

export const ServicioTecnico = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | null>(null);
  const [limit, setLimit] = useState<number>(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("page");
  const [page, setPage] = useState<number>(Number(query) || 1);
  const [columnOrder, setColumnOrder] = useState(false);
  const { countryCode } = useUserStore();

  const navigate = useNavigate();
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
    setSearchParams({ page: page.toString() });
  }, [page, setSearchParams]);

  const { data: { contactos = [], totalPages = 1 } = {}, isLoading } = useQuery(
    {
      queryKey: [
        "servicios",
        debouncedSearch,
        filter,
        limit,
        page - 1,
        columnOrder,
      ],
      queryFn: async () => {
        try {
          const { data } = await axios.get(
            `${apiUrl}/admin/contacts/messages`,
            {
              params: {
                countryCode,
                contactType: "SERVICE",
                name: debouncedSearch,
                status: filter,
                limit: Number(limit),
                page: page - 1,
                idOrder: columnOrder ? "asc" : "desc",
              },
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

  const { data: { totalCount, pendingContacts, endedContacts } = {} } =
    useQuery({
      queryKey: ["datosContactos", countryCode],
      queryFn: async () => {
        try {
          const { data } = await axios.get(
            `${apiUrl}/admin/contacts/messages/count`,
            {
              params: { countryCode, contactType: "SERVICE" },
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
    });

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
      header: "Company",
      accessorKey: "company",
    },
    {
      header: "Status",
      accessorKey: "status.name",
      cell: ({ getValue }: { getValue: () => any }) => {
        return (
          <div
            className={`p-2 rounded-lg text-center text-white ${
              getValue() === "PENDIENTE"
                ? "bg-gray-400 "
                : getValue() === "FINALIZADO"
                ? "bg-green-400"
                : ""
            }`}
          >
            {getValue() === "PENDIENTE"
              ? "PENDING"
              : getValue() === "FINALIZADO"
              ? "COMPLETED"
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
          pendiente={pendingContacts || 0}
          enviada={endedContacts || 0}
          tituloTotal="Received messages"
          tituloPendiente="Pending messages"
          tituloEnviada="Completed services"
        />
        <div className="w-full h-auto bg-white rounded-3xl shadow-lg p-8 mb-12 text-gray-600">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-medium text-center">
              Technical Service
            </h1>
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
            datosTabla={contactos}
            columns={columns}
            detailsRoute="servicios"
            isLoading={isLoading}
            handlerColumnFilter={() => {
              setColumnOrder((prev) => !prev);
            }}
          />
          {totalCount > 10 && (
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
          )}
        </div>
      </div>
    </>
  );
};
