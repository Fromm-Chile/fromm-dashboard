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
    staleTime: 5 * 60 * 1000,
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
            <span className="text-green-500">Activo</span>
          ) : (
            <span className="text-red-500">Inactivo</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="pb-10 pt-10">
        <div className="w-full h-auto bg-white rounded-3xl shadow-lg p-8 mb-12 text-gray-600">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-medium text-center">
              Usuarios del Panel Admistrativo
            </h1>
            <button
              className="cursor-pointer hover:bg-red-400 bg-red-500 rounded-lg text-white p-4 hover:shadow-lg transition-all"
              onClick={() => navigate("/nuevo-usuario")}
            >
              CREAR USUARIO
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
    </>
  );
};
