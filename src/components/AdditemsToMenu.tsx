import { useEffect, useState } from "react";
import type { ModalSubmitData } from "./AdminPanel";
import DropdownField from "./DropdownField";
// import process from "process";

interface DrinksProps {
  id: number;
  name: string;
  volume_ml: number;
}

interface GlassesProps {
  id: number;
  amount_ml: number;
}

interface AddItemToMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: ModalSubmitData) => void;
  serverError: string;
}
// const IPADDRESS = process.env.IPADDRESS;

const ipaddress = "http://192.168.1.160";
// const ipaddress = "http://localhost";
const AdditemsToMenu: React.FC<AddItemToMenuProps> = ({
  isOpen,
  onClose,
  onSuccess,
  serverError,
}) => {
  const [drinks, setDrinks] = useState<DrinksProps[]>([]);
  const [glasses, setGlasses] = useState<GlassesProps[]>([]);

  const [selected1, setSelected1] = useState<DrinksProps | null>(null);
  const [selected2, setSelected2] = useState<string | null>(null);

  const [inputName, setInputName] = useState("");
  const [inputVolume, setInputVolume] = useState("");
  const [input2, setInput2] = useState("");

  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<"dodaj" | "obrisi" | "izmeni">(
    "dodaj"
  );

  // Učitavanje podataka kada se modal otvori
  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          fetch(`${ipaddress}:3001/api/drinks`),
          fetch(`${ipaddress}:3001/api/getGlasses`),
        ]);

        const drinksJson = await res1.json();
        setDrinks(drinksJson.data);

        const glassesJson = await res2.json();
        setGlasses(glassesJson.data);
      } catch (err) {
        console.error("Greška pri učitavanju podataka:", err);
      }
    };

    fetchData();
  }, [isOpen]);

  // Resetovanje forme prilikom promene taba
  useEffect(() => {
    setError(false);
    setSelected1(null);
    setSelected2(null);
    setInputName("");
    setInputVolume("");
    setInput2("");
  }, [activeTab]);

  const handleSubmit = () => {
    setError(false);

    if (activeTab === "dodaj") {
      if (
        (!selected1 && (!inputName.trim() || !inputVolume.trim())) ||
        (!selected2 && !input2.trim())
      ) {
        setError(true);
        return;
      }

      const drinkData = selected1
        ? { name: selected1.name, volume_ml: selected1.volume_ml }
        : { name: inputName.trim(), volume_ml: parseInt(inputVolume, 10) };

      const glassAmount = selected2
        ? parseInt(selected2, 10)
        : parseInt(input2, 10);

      onSuccess({
        action: "add",
        payload: {
          first: drinkData,
          second: glassAmount,
        },
      });
    } else if (activeTab === "obrisi") {
      if (!selected1) {
        setError(true);
        return;
      }

      onSuccess({
        action: "delete",
        payload: { id: selected1.id },
      });
    } else if (activeTab === "izmeni") {
      // Placeholder – možeš proširiti kasnije
      alert("Izmena još uvek nije implementirana.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex space-x-6 border-b border-gray-200 mb-6">
          <h2
            className={`text-xl font-semibold pb-2 cursor-pointer border-b-2 ${
              activeTab === "dodaj"
                ? "text-gray-800 border-blue-500"
                : "text-gray-500 border-transparent hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("dodaj")}
          >
            Dodaj stavku u meni
          </h2>

          <h2
            className={`text-xl font-semibold pb-2 cursor-pointer border-b-2 ${
              activeTab === "obrisi"
                ? "text-red-600 border-red-500"
                : "text-gray-500 border-transparent hover:border-red-300"
            }`}
            onClick={() => setActiveTab("obrisi")}
          >
            Obriši piće
          </h2>

          <h2
            className={`text-xl font-semibold pb-2 cursor-pointer border-b-2 ${
              activeTab === "izmeni"
                ? "text-green-600 border-green-500"
                : "text-gray-500 border-transparent hover:border-green-300"
            }`}
            onClick={() => setActiveTab("izmeni")}
          >
            Izmeni piće
          </h2>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {activeTab === "obrisi"
              ? "Moraš izabrati piće za brisanje."
              : "Popuni sva polja."}
          </p>
        )}

        {activeTab === "dodaj" && (
          <>
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
          </>
        )}

        {activeTab === "obrisi" && (
          <DropdownField
            label="Izaberi piće za brisanje"
            options={drinks}
            selected={selected1}
            setSelected={setSelected1}
            getOptionLabel={(drink) => `${drink.name} ${drink.volume_ml}ml`}
          />
        )}

        {activeTab === "izmeni" && (
          <p className="text-gray-500">Funkcionalnost izmjene u izradi...</p>
        )}

        <div className="mt-6 space-y-4">
          {serverError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Otkaži
            </button>

            <button
              onClick={handleSubmit}
              className={`rounded-md px-5 py-2 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                activeTab === "obrisi"
                  ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {activeTab === "dodaj" && "Sačuvaj"}
              {activeTab === "obrisi" && "Obriši"}
              {activeTab === "izmeni" && "Sačuvaj izmene"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditemsToMenu;
