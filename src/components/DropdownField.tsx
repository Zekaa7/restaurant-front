import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface DropdownFieldProps<T> {
  label: string;
  options: T[];
  selected: T | null;
  setSelected: (v: T | null) => void;
  inputValue: string;
  setInputValue: (v: string) => void;
  inputExtraValue?: string;
  setInputExtraValue?: (v: string) => void;
  getOptionLabel?: (option: T) => string;
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
  casa,
}: DropdownFieldProps<T>) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <Listbox value={selected ?? undefined} onChange={setSelected}>
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
            {/* Opcija za poništavanje izbora */}
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

            {options.map((opt, idx) => (
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

      {/* Input polja se prikazuju SAMO ako ništa nije selektovano */}
      {!selected && (
        <>
          <input
            type={casa ? "number" : "text"}
            placeholder={casa ? "Unesi veličinu case (ml)" : "Naziv..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            min={casa ? 1 : undefined}
            className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {inputExtraValue !== undefined && setInputExtraValue && (
            <input
              type="number"
              placeholder="Veličina case (ml)..."
              value={inputExtraValue}
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
