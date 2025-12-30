import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

interface DropdownFieldProps<T> {
  label: string;
  options: T[];
  selected: T | null;
  setSelected: (v: T | null) => void;

  inputValue?: string;
  setInputValue?: (v: string) => void;
  inputExtraValue?: string;
  setInputExtraValue?: (v: string) => void;

  stockInputValue?: string;
  setStockInputValue?: (v: string) => void;

  // Opcioni prop: kako da dobijemo ID iz selected objekta
  getItemId?: (item: T) => number;

  getOptionLabel?: (option: T) => string;
  casa?: boolean;
  enableStockInput?: boolean;

  mode?: "add-to-menu" | "increment-stock";
}

const ipaddress = "http://localhost:3001";
// const ipaddress = "http://192.168.1.160";

function DropdownField<T>({
  label,
  options,
  selected,
  setSelected,
  inputValue,
  setInputValue,
  inputExtraValue,
  setInputExtraValue,
  stockInputValue,
  setStockInputValue,
  getItemId,
  getOptionLabel = (option: T) => String(option),
  casa = false,
  enableStockInput = false,
  mode,
}: DropdownFieldProps<T>) {
  const [filter, setFilter] = useState("");
  const [currentStock, setCurrentStock] = useState<number | null>(null);
  const [loadingStock, setLoadingStock] = useState(false);

  const filteredOptions = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(filter.toLowerCase())
  );

  const isCreatingNew = !selected;
  const shouldShowCreateInputs =
    isCreatingNew &&
    (setInputValue !== undefined || setInputExtraValue !== undefined);

  const canEditStock = enableStockInput && setStockInputValue !== undefined;
  const shouldShowStockInput =
    canEditStock &&
    (isCreatingNew ? shouldShowCreateInputs : selected !== null);

  useEffect(() => {
    if (!selected || !getItemId) {
      setCurrentStock(null);
      return;
    }

    const itemId = getItemId(selected);
    console.log(itemId);
    const fetchStock = async () => {
      setLoadingStock(true);
      try {
        const response = await fetch(`${ipaddress}/api/getCurrentStock`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ drink_id: itemId }),
        });

        if (!response.ok) throw new Error();

        const data = await response.json();
        setCurrentStock(data.quantity);
      } catch (err) {
        console.error("Greška pri dohvatanju zalihe:", err);
        setCurrentStock(0);
      } finally {
        setLoadingStock(false);
      }
    };

    fetchStock();
  }, [selected, getItemId]);

  return (
    <div className="mb-6">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <Listbox value={selected ?? null} onChange={setSelected}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500">
            <span className="block truncate">
              {selected ? getOptionLabel(selected) : "Izaberi..."}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Pretraži..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Listbox.Option
              value={null}
              className={({ active }) =>
                `cursor-pointer select-none px-4 py-2 ${
                  active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                }`
              }
            >
              Izaberi...
            </Listbox.Option>

            {filteredOptions.map((opt, idx) => (
              <Listbox.Option
                key={idx}
                value={opt}
                className={({ active }) =>
                  `cursor-pointer select-none px-4 py-2 ${
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected: isSelected }) => (
                  <div className="flex justify-between">
                    <span
                      className={isSelected ? "font-medium" : "font-normal"}
                    >
                      {getOptionLabel(opt)}
                    </span>
                    {isSelected && (
                      <CheckIcon className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>

      {/* Kreiranje novog */}
      {/* Kreiranje novog – početna zaliha */}
      {shouldShowCreateInputs && (
        <div className="mt-4 space-y-3">
          {setInputValue !== undefined && (
            <input
              autoFocus={!casa}
              type={casa ? "number" : "text"}
              placeholder={
                !casa ? "Unesi naziv pića..." : "Unesi veličinu čaše (ml)"
              }
              value={inputValue ?? ""}
              onChange={(e) => setInputValue(e.target.value)}
              min={casa ? 1 : undefined}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {setInputExtraValue !== undefined && (
            <input
              type="number"
              placeholder="Zapremina pića (ml)..."
              value={inputExtraValue ?? ""}
              onChange={(e) => setInputExtraValue(e.target.value)}
              min={1}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {shouldShowStockInput && isCreatingNew && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <label className="block text-sm font-medium text-blue-800 mb-2">
                Početna zaliha (komada)
              </label>
              <input
                type="number"
                placeholder="Koliko flaša na početku?"
                value={stockInputValue ?? ""}
                onChange={(e) => setStockInputValue(e.target.value)}
                min={0}
                className="w-full rounded-md border border-blue-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      )}

      {/* Dopuna zalihe – SAMO u modu "increment-stock" */}
      {mode === "increment-stock" && shouldShowStockInput && selected && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <label className="block text-sm font-medium text-green-800 mb-2">
            Dopuni zalihu
          </label>
          <input
            type="number"
            placeholder="Koliko komada dodati?"
            value={stockInputValue ?? ""}
            onChange={(e) => setStockInputValue(e.target.value)}
            min={1}
            className="w-full rounded-md border border-green-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="mt-2 space-y-1">
            <p className="text-sm text-green-700">
              Izabrano: <strong>{getOptionLabel(selected)}</strong>
            </p>
            <p className="text-sm text-green-700">
              Trenutno na stanju:{" "}
              <strong>
                {loadingStock ? "Učitavanje..." : `${currentStock ?? 0} komada`}
              </strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DropdownField;
