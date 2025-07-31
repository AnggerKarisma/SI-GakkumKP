import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onItemsPerPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  const handlePageClick = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const pageNumbers = [];
  // Logika untuk menampilkan nomor halaman (misal: 1, 2, ..., 10)
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-center text-white mt-4 text-sm gap-4">
      <p>
        Showing {startItem} to {endItem} of {totalItems} results
      </p>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span>Per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-[#242424] border border-gray-600 rounded-md px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageClick(number)}
              className={`px-3 py-1 rounded-md ${currentPage === number ? "bg-[#1f4f27]" : "hover:bg-gray-700"}`}
            >
              {number}
            </button>
          ))}
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;