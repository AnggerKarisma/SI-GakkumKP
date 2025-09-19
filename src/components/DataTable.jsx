import { ArrowUpDown } from "lucide-react";

const DataTable = ({ columns, data, sortConfig, onSort }) => {
    const StatusBadge = ({ status }) => {
        const statusStyle = {
            "Stand by": "text-green-500",
            "Not Available": "text-red-500",
            "Maintenance": "text-yellow-500",

            // Status untuk peminjaman
            Dikembalikan: "text-green-500",
            Dipinjam: "text-yellow-500",
            Terlambat: "text-red-500",
        };
        return (
            <span
                className={`font-semibold ${
                    statusStyle[status] || "text-white"
                }`}
            >
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
                            key={col.accessor || col.header}
                            scope="col"
                            className="px-6 py-3 whitespace-nowrap"
                            onClick={() => col.sortable && onSort(col.accessor)}
                        >
                            <div
                                className={`flex items-center justify-center gap-2 ${col.sortable ? "cursor-pointer" : ""}`}
                            >
                                {col.header}
                                {/* PERUBAHAN: Mengembalikan mekanisme sorting icon ke versi sebelumnya */}
                                {col.sortable && (
                                    <ArrowUpDown
                                        className={`w-4 h-4 transition-colors ${
                                            sortConfig?.key === col.accessor
                                                ? "text-yellow-400" // Warna saat kolom aktif
                                                : "text-white"
                                        }`}
                                    />
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((row, rowIndex) => (
                        <tr
                            key={
                                row.kendaraanID ||
                                row.userID ||
                                row.pajakID ||
                                rowIndex
                            }
                            className="bg-[#171717] border-b border-gray-700 hover:bg-gray-800/50"
                        >
                            {columns.map((col) => (
                                <td
                                    key={col.accessor || col.header}
                                    className="px-6 py-4 whitespace-nowrap"
                                >
                                    {col.accessor === "status" ||
                                    col.accessor === "statKendaraan" ? (
                                        <StatusBadge
                                            status={row[col.accessor]}
                                        />
                                    ) : col.cell ? (
                                        col.cell(row, rowIndex)
                                    ) : // Menggunakan reduce untuk mengambil data nested jika ada
                                    col.accessor ? (
                                        col.accessor
                                            .split(".")
                                            .reduce(
                                                (acc, part) => acc && acc[part],
                                                row,
                                            )
                                    ) : null}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan={columns.length}
                            className="text-center py-10 text-gray-400"
                            a
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