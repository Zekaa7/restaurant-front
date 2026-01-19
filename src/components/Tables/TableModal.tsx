import React from "react";
import type { Table } from "./TableManagment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TableIcon from "../../assets/icons/table_restaurant.svg";

interface TableModalProps {
  table: Table | null;
  onClose: () => void;
  onReserve?: (tableId: number) => void;
}

const TableModal = ({ table, onClose, onReserve }: TableModalProps) => {
  const [reservationDateTime, setReservationDateTime] =
    React.useState<Date | null>(null);
  if (!table) return null;
  const getStatusLabel = (status: Table["status"]) => {
    switch (status) {
      case "free":
        return "Slobodan";
      case "occupied":
        return "Zauzet";
      case "reserved":
        return "Rezervisan";
      default:
        return "Nepoznat";
    }
  };
  const getStatusColor = (status: Table["status"]) => {
    switch (status) {
      case "free":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "occupied":
        return "bg-rose-600 hover:bg-rose-700";
      case "reserved":
        return "bg-indigo-600 hover:bg-indigo-700";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  function formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}.${month}.${year}. ${hours}:${minutes}`;
  }

  //Post req za promenu iz slobodnog u rezervisano
  const handleConfirmReservation = () => {
    console.log(formatDateTime(reservationDateTime!));
    onClose();
  };
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-2xl font-bold flex items-center text-gray-800">
            Sto broj {table.id}{" "}
            {
              <img
                src={TableIcon}
                alt="Stolovi"
                className="w-8 h-8 mx-auto"
                style={{
                  filter:
                    "invert(26%) sepia(51%) saturate(2872%) hue-rotate(347deg) brightness(94%) contrast(90%)", // ≈ #8B4513 saddlebrown
                }}
              />
            }
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <span className="text-gray-600 ">Status:</span>{" "}
            <span className="font-semibold">
              {getStatusLabel(table.status)}
            </span>
          </div>
          {/* Akcije po statusu */}
          {/* {table.status === "free" && (
            <button
              onClick={() => {
                onReserve?.(table.id);
                onClose();
              }}
              className={`w-full py-3 text-white font-medium rounded-lg transition ${getStatusColor(
                "free"
              )}`}
            >
              Rezerviši sto
            </button>
          )} */}

          {table.status === "free" && (
            <div className="space-y-6">
              <div className="rounded-xl bg-gray-50 p-5 shadow-sm border border-gray-200 text-center">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Datum i vreme rezervacije
                </label>

                <div className="relative">
                  <span className="absolute left-24 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                    📅
                  </span>

                  <DatePicker
                    selected={reservationDateTime}
                    onChange={(date: Date | null) =>
                      setReservationDateTime(date)
                    }
                    showTimeSelect
                    shouldCloseOnSelect={true}
                    timeFormat="HH:mm"
                    timeIntervals={30}
                    dateFormat="dd.MM.yyyy HH:mm"
                    minDate={new Date()}
                    placeholderText="Izaberi datum i vreme"
                    className={`
            w-full rounded-lg border border-gray-300 bg-white
            pl-10 pr-4 py-2.5 text-sm
            shadow-sm
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
            focus:outline-none transition
          `}
                    calendarClassName="rounded-xl shadow-xl border border-gray-200"
                    popperPlacement="top-start"
                    popperClassName="z-50"
                  />
                </div>

                <p className="mt-2.5 text-xs text-gray-500">
                  Izaberite datum i vreme za rezervaciju stola (minimalno 30 min
                  unapred)
                </p>
              </div>

              <button
                type="button"
                onClick={handleConfirmReservation}
                disabled={!reservationDateTime}
                className={`
        w-full py-3.5 px-4 text-white font-medium rounded-lg transition-all
        shadow-sm
        ${
          reservationDateTime
            ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
            : "bg-gray-300 cursor-not-allowed text-gray-500"
        }
      `}
              >
                {reservationDateTime ? (
                  <>Rezerviši za {formatDateTime(reservationDateTime)}</>
                ) : (
                  "Izaberite datum i vreme"
                )}
              </button>
            </div>
          )}
          {table.status === "reserved" && (
            <button
              onClick={() => {
                // ovdje možeš imati logiku za potvrdu dolaska
                onClose();
              }}
              className={`w-full py-3 text-white font-medium rounded-lg transition ${getStatusColor(
                "reserved"
              )}`}
            >
              Potvrdi dolazak
            </button>
          )}
          {/* 
          {table.status === "occupied" && (
            <button
              onClick={() => {
                // onCheckout?.(table.id);
                onClose();
              }}
              className={`w-full py-3 text-white font-medium rounded-lg transition ${getStatusColor(
                "occupied"
              )}`}
            >
              Zatvori račun
            </button>
          )} */}
          <button
            onClick={onClose}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
          >
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableModal;
