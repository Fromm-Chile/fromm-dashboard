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
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b-2 border-gray-200">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={handlerColumnFilter}
                  className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer"
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
              className="cursor-pointer hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-4 py-3 text-sm text-slate-600"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getPageCount() === 0 && (
        <div className="flex justify-center items-center h-28 text-slate-400 text-sm">
          <p>No results found...</p>
        </div>
      )}
    </div>
  );
};
