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
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, [page, setSearchParams]);

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
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Company",
      accessorKey: "company",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div>{getValue() || "No record"}</div>
      ),
    },
  ];

  return (
    <div className="pb-8">
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="mb-5 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-slate-800">Clients</h1>
        </div>
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <div className="border border-gray-200 rounded-lg flex items-center flex-1 max-w-[400px]">
            <img
              src="/icons/search.svg"
              height={16}
              width={16}
              className="ml-3 opacity-40"
            />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 rounded-lg outline-none w-full text-sm"
            />
          </div>
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
          datosTabla={users}
          columns={columns}
          detailsRoute="clientes"
          isLoading={isLoading}
          handlerColumnFilter={() => {
            setColumnOrder((prev) => !prev);
          }}
        />
        <div className="flex items-center justify-end mt-5 gap-2">
          <button
            onClick={() =>
              setPage((prev) => (prev > 0 ? prev - 1 : prev))
            }
            disabled={page === 1}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 cursor-pointer transition-colors"
          >
            <img src="/icons/left-arrow.svg" height={16} width={16} />
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
            <img
              src="/icons/right-arrow-black.svg"
              height={16}
              width={16}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
