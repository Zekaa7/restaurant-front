import { useEffect, useState } from "react";
import type { MenuItemData } from "./AdminPanel";
import DropdownField from "./DropdownField";

interface AddItemToMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: MenuItemData) => void;
}

interface DrinksProps {
  id: number;
  name: string;
  volume_ml: number;
}

interface GlassesProps {
  id: number;
  amount_ml: number;
}

const AdditemsToMenu: React.FC<AddItemToMenuProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [drinks, setDrinks] = useState<DrinksProps[]>([]);
  const [glasses, setGlasses] = useState<GlassesProps[]>([]);

  const [selected1, setSelected1] = useState<DrinksProps | null>(null);
  const [selected2, setSelected2] = useState<string | null>(null);

  const [inputName, setInputName] = useState("");
  const [inputVolume, setInputVolume] = useState("");
  const [input2, setInput2] = useState("");

  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch("http://localhost:3001/api/drinks"),
          fetch("http://localhost:3001/api/getGlasses"),
        ]);

        const drinksJson = await res1.json();
        setDrinks(drinksJson.data);

        const glassesJson = await res2.json();
        setGlasses(glassesJson.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [isOpen]);

  const handleSubmit = () => {
    if (
      (!selected1 && (!inputName || !inputVolume)) ||
      (!selected2 && !input2)
    ) {
      setError(true);
      return;
    }

    const dataToSend: MenuItemData = {
      first: selected1
        ? { name: selected1.name, volume_ml: selected1.volume_ml }
        : { name: inputName, volume_ml: parseInt(inputVolume, 10) },
      second: selected2 ? parseInt(selected2, 10) : parseInt(input2, 10),
    };

    onSuccess(dataToSend);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold text-gray-800">
          Dodaj stavku u meni
        </h2>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            Popuni sva polja.
          </p>
        )}

        {/* First dropdown + dva inputa */}
        <DropdownField
          label="Kategorija (piće)"
          options={drinks}
          selected={selected1}
          setSelected={setSelected1}
          inputValue={inputName}
          setInputValue={setInputName}
          inputExtraValue={inputVolume}
          setInputExtraValue={setInputVolume}
          getOptionLabel={(drink) => `${drink.name} ${drink.volume_ml}ml`}
        />

        {/* Second dropdown */}
        <DropdownField
          label="Veličina čaše"
          options={glasses.map((g) => `${g.amount_ml} ml`)}
          selected={selected2}
          setSelected={setSelected2}
          inputValue={input2}
          setInputValue={setInput2}
          getOptionLabel={(opt) => opt}
          casa={true}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Otkaži
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Sačuvaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditemsToMenu;
