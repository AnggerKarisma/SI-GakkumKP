import StatusBadge from "./StatusBadge";
import { ArrowUpDown } from "lucide-react";

const DataTable = ({ columns, data }) => {

  return (
    <table className="w-full text-xs text-center text-white">
      <thead className="text-sm uppercase bg-[#1f4f27]">
        <tr>
          {columns.map((col) => (
            <th
              key={col.accessor}
              scope="col"
              className="px-6 py-3 whitespace-nowrap"
            >
              <div className="flex items-center justify-center gap-2">
                {col.header}
                {col.sortable && <ArrowUpDown className="w-4 h-4" />}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="bg-[#171717] border-b border-gray-700 hover:bg-gray-800/50"
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-6 py-4 whitespace-nowrap">
                  {col.accessor === "status" ? (
                    <StatusBadge status={row[col.accessor]} />
                  ) : col.cell ? (
                    col.cell(row)
                  ) : (
                    row[col.accessor]
                  )}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center py-10 text-gray-400"
            >
              Tidak ada data.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DataTable;