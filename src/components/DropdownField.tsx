import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

interface DropdownFieldProps<T> {
  label: string;
  options: T[];
  selected: T | null;
  setSelected: (v: T | null) => void;

  // Opcioni input za kreiranje nove opcije kada ništa nije izabrano
  inputValue?: string;
  setInputValue?: (v: string) => void;

  // Dodatno polje (npr. za volume_ml kod pića ili amount_ml kod čaše)
  inputExtraValue?: string;
  setInputExtraValue?: (v: string) => void;

  getOptionLabel?: (option: T) => string;

  // Da li je ovo dropdown za "čašu" (pa treba number input)
  casa?: boolean;
}

function DropdownField<T>({
  label,
  options,
  selected,
  setSelected,
  inputValue,
  setInputValue,
  inputExtraValue,
  setInputExtraValue,
  getOptionLabel = (option: T) => String(option),
  casa = false,
}: DropdownFieldProps<T>) {
  const [filter, setFilter] = useState("");

  const filteredOptions = options.filter((opt) =>
    getOptionLabel(opt).toLowerCase().includes(filter.toLowerCase())
  );

  // Da li treba prikazati input polja za unos nove vrednosti?
  const shouldShowInputs =
    !selected &&
    (setInputValue !== undefined || setInputExtraValue !== undefined);

  return (
    <div className="mb-4">
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
            {/* Pretraga */}
            <div className="px-3 py-2">
              <input
                type="text"
                placeholder="Pretraži..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Opcija za reset */}
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

      {/* Prikaz inputa samo ako je ništa nije selektovano I ako su prosleđeni handleri */}
      {shouldShowInputs && (
        <>
          {/* Glavni input (naziv pića ili veličina čaše) */}
          {setInputValue !== undefined && (
            <input
              type={casa ? "number" : "text"}
              placeholder={
                casa ? "Unesi veličinu čaše (ml)" : "Unesi naziv pića..."
              }
              value={inputValue ?? ""}
              onChange={(e) => setInputValue(e.target.value)}
              min={casa ? 1 : undefined}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {/* Dodatno polje (npr. volume_ml za piće) */}
          {setInputExtraValue !== undefined && (
            <input
              type="number"
              placeholder="Zapremina pića (ml)..."
              value={inputExtraValue ?? ""}
              onChange={(e) => setInputExtraValue(e.target.value)}
              min={1}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </>
      )}
    </div>
  );
}

export default DropdownField;
