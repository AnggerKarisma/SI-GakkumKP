import { ArrowUpDown } from "lucide-react";
// --- Komponen DataTable (Diperbarui) ---
// Komponen ini harus diperbarui untuk meneruskan 'index' ke fungsi 'cell'
const DataTable = ({ columns, data }) => {
  const StatusBadge = ({ status }) => {
    const statusStyle = {
      Ready: "text-green-500",
      Dikembalikan: "text-green-500",
      Used: "text-yellow-500",
      Dipinjam: "text-yellow-500",
      Unready: "text-red-500",
      Terlambat: "text-red-500",
    };
    return (
      <span className={`font-semibold ${statusStyle[status] || "text-white"}`}>
        {status}
      </span>
    );
  };

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
              key={row.id}
              className="bg-[#171717] border-b border-gray-700 hover:bg-gray-800/50"
            >
              {columns.map((col) => (
                <td key={col.accessor} className="px-6 py-4 whitespace-nowrap">
                  {/* FIX: Logika ini sekarang akan memanggil StatusBadge dengan benar */}
                  {col.accessor === "status" ? (
                    <StatusBadge status={row.status} />
                  ) : col.cell ? (
                    col.cell(row, rowIndex)
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