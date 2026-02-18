import { apiUrl } from "../assets/variables";
import { Table } from "../components/Table";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";

export const AdminUsers = () => {
  const navigate = useNavigate();

  const { data: adminUsers = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/users-admin`, {
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
      header: "Role",
      accessorKey: "role.name",
    },
    {
      header: "Activo",
      accessorKey: "isActive",
      cell: ({ getValue }: { getValue: () => any }) => (
        <div className="text-center">
          {getValue() ? (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
              Activo
            </span>
          ) : (
            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
              Inactivo
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="pb-8 pt-6">
      <div className="w-full bg-white border border-gray-200 rounded-xl p-6 mb-8">
        <div className="mb-5 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-slate-800">
            Usuarios del Panel Admistrativo
          </h1>
          <button
            className="cursor-pointer bg-slate-900 hover:bg-slate-800 rounded-lg text-white text-sm font-medium px-4 py-2.5 transition-colors"
            onClick={() => navigate("/nuevo-usuario")}
          >
            Crear Usuario
          </button>
        </div>

        <Table
          datosTabla={adminUsers}
          columns={columns}
          detailsRoute="usuarios"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
