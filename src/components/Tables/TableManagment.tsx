import { useState } from "react";
import TableModal from "./TableModal";

type TableStatus = "free" | "occupied" | "reserved";

export interface Table {
  id: number;
  status: TableStatus;
}

const TableManagement = () => {
  const initialTables: Table[] = [
    { id: 1, status: "free" },
    { id: 2, status: "occupied" },
    { id: 3, status: "reserved" },
    { id: 4, status: "free" },
    { id: 5, status: "occupied" },
    { id: 6, status: "free" },
    { id: 7, status: "reserved" },
    { id: 8, status: "occupied" },
    { id: 9, status: "free" },
    { id: 10, status: "free" },
    { id: 11, status: "reserved" },
    { id: 12, status: "occupied" },
    { id: 13, status: "free" },
    { id: 14, status: "reserved" },
    { id: 15, status: "free" },
  ];

  const [tables, setTables] = useState<Table[]>(initialTables);
  const [showOnlyFree, setShowOnlyFree] = useState(false);

  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  const getStatusStyles = (status: TableStatus) => {
    switch (status) {
      case "free":
        return {
          bg: "bg-emerald-500 hover:bg-emerald-600",
          text: "text-white",
          indicator: "bg-emerald-700",
          label: "Slobodan",
        };
      case "occupied":
        return {
          bg: "bg-rose-500 hover:bg-rose-600",
          text: "text-white",
          indicator: "bg-rose-700",
          label: "Zauzet",
        };
      case "reserved":
        return {
          bg: "bg-indigo-500 hover:bg-indigo-600",
          text: "text-white",
          indicator: "bg-indigo-700",
          label: "Rezervisan",
        };
      default:
        return { bg: "", text: "", indicator: "", label: "" };
    }
  };
  //Prosledjuje informacije o izabranom stolu
  const selectedTable = tables.find((t) => t.id === selectedTableId) ?? null;
  const displayedTables = showOnlyFree
    ? tables.filter((t) => t.status === "free")
    : tables;

  const handleReserve = (tableId: number) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, status: "reserved" } : t))
    );
    // ovdje možeš dodati API poziv, toast obavijest i sl.
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
              key={table.id}
              onClick={() => setSelectedTableId(table.id)}
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
                {table.id}
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
          onReserve={handleReserve}
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
