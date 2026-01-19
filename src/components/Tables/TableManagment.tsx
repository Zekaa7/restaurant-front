import { useEffect, useState } from "react";
import TableModal from "./TableModal";
import { getStatusStyles, ipHome } from "../../helper";
import { authFetch } from "../../FetchApis";

export type TableStatus = "FREE" | "OCCUPIED" | "RESERVED" | "NOTINUSE";

export interface Table {
  table_id: number;
  status: TableStatus;
  table_number: number;
  description: string;
  status_s: string;
}

const TableManagement = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  useEffect(() => {
    const getTableGrid = async () => {
      try {
        const res = await authFetch(`${ipHome}/tables`);
        const { data } = await res.json();
        setTables(data);
      } catch (error) {
        console.error(error);
      }
    };
    getTableGrid();
  }, []);

  //Prosledjuje informacije o izabranom stolu
  const selectedTable =
    tables.find((t) => t.table_id === selectedTableId) ?? null;
  const displayedTables = showOnlyFree
    ? tables.filter((t) => t.status === "FREE")
    : tables;

  const handleStatusChange = (tableId: number, status: TableStatus) => {
    setTables((prev) =>
      prev.map((t) => (t.table_id === tableId ? { ...t, status: status } : t))
    );
  };
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        <span className="text-sm font-medium text-gray-700">Samo slobodni</span>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!showOnlyFree}
            onChange={() => setShowOnlyFree(!showOnlyFree)}
            className="sr-only peer"
          />
          <div
            className={`
      w-14 h-7 bg-gray-200 peer-focus:outline-none 
      peer-focus:ring-4 peer-focus:ring-indigo-300 
      rounded-full peer 
      peer-checked:after:translate-x-full 
      peer-checked:after:border-white 
      after:content-[''] after:absolute after:top-0.5 after:left-[4px] 
      after:bg-white after:border-gray-300 after:border after:rounded-full 
      after:h-6 after:w-6 after:transition-all 
      peer-checked:bg-indigo-600
    `}
          />
        </label>

        <span className="text-sm font-medium text-gray-700">Svi stolovi</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Upravljanje stolovima
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-6">
        {displayedTables.map((table) => {
          const styles = getStatusStyles(table.status);

          return (
            <div
              key={table.table_id}
              onClick={() => setSelectedTableId(table.table_id)}
              className={`
                relative flex flex-col items-center justify-center 
                h-24 w-24 sm:h-28 sm:w-28 
                rounded-full 
                shadow-lg transition-all duration-300
                cursor-pointer
                hover:scale-105 hover:shadow-xl
                border-4 border-white
                ${styles.bg}
              `}
            >
              <span
                className={`text-3xl sm:text-4xl font-extrabold drop-shadow-md ${styles.text}`}
              >
                {table.table_id}
              </span>

              <span
                className={`text-xs sm:text-sm font-medium mt-1 opacity-90 ${styles.text}`}
              >
                {styles.label}
              </span>

              <div
                className={`
                  absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white
                  ${styles.indicator}
                `}
              />
            </div>
          );
        })}
      </div>
      {selectedTable && (
        <TableModal
          table={selectedTable}
          onClose={() => setSelectedTableId(null)}
          onStatusChange={handleStatusChange}
        />
      )}
      {/* Legenda */}
      <div className="mt-10 flex flex-wrap justify-center gap-6 sm:gap-8 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
          Slobodan
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-rose-500 border-2 border-white shadow-sm" />
          Zauzet
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-indigo-500 border-2 border-white shadow-sm" />
          Rezervisan
        </div>
      </div>
    </div>
  );
};

export default TableManagement;
