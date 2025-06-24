import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useNavigate } from "react-router";
import { Loader } from "./Loader";

type Columns = {
  header: string;
  accessorKey: string;
  cell?: (info: { getValue: () => any }) => any;
};

type TableProps = {
  datosTabla: any[];
  columns: Columns[];
  onClick?: () => void;
  hasButton?: boolean;
  detailsRoute: string;
  handlerColumnFilter?: () => void;
  isLoading?: boolean;
};

export const Table = ({
  datosTabla,
  columns,
  detailsRoute,
  handlerColumnFilter,
  isLoading,
}: TableProps) => {
  const navigate = useNavigate();

  const table = useReactTable({
    data: datosTabla,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="relative">
      {isLoading && <Loader />}
      <table className="w-full relative">
        <thead className="cursor-pointer">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={handlerColumnFilter}
                  className="p-6 text-left text-gray-500 font-bold text-md bg-gray-100 uppercase"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => navigate(`/${detailsRoute}/${row.original.id}`)}
              className="cursor-pointer hover:bg-gray-100/50 transition-all"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="py-2 px-6 border-b border-gray-200"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getPageCount() === 0 && (
        <div className="flex justify-center items-center h-28">
          <p>No results found...</p>
        </div>
      )}
    </div>
  );
};
