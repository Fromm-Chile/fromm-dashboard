import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { useUserStore } from "../store/useUserStore";
import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import { useNavigate, useSearchParams } from "react-router";

export const Clientes = () => {
  const [search, setSearch] = useState("");
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

  const { data: { users = [], totalPages = 1 } = {}, isLoading } = useQuery({
    queryKey: [
      "clientes",
      countryCode,
      debouncedSearch,
      limit,
      page,
      columnOrder,
    ],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/admin/users`, {
          params: {
            countryCode,
            name: debouncedSearch,
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
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, [page, setSearchParams]);

  const columns = [
    {
      header: "Nro",
      accessorKey: "id",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">{getValue()}</div>
      ),
    },
    {
      header: "Nombre",
      accessorKey: "name",
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Empresa",
      accessorKey: "company",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">{getValue() || "Sin registro"}</div>
      ),
    },
  ];

  return (
    <>
      <div className="pb-10">
        <div className="w-full h-auto bg-white rounded-3xl shadow-lg p-8 mb-12 text-gray-600">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-medium text-center">Clientes</h1>
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
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded-lg outline-none w-[450px]"
              />
            </div>
            <div className="flex justify-end pb-6"></div>
            <div className="border-2 border-gray-200 rounded-lg p-2 flex gap-5 items-center">
              <p>Mostrar</p>
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
              <p>registros</p>
            </div>
          </div>
          <Table
            datosTabla={users}
            columns={columns}
            detailsRoute="clientes"
            isLoading={isLoading}
            handlerColumnFilter={() => {
              setColumnOrder((prev) => !prev);
            }}
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
                  Página {page} de {totalPages}
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
