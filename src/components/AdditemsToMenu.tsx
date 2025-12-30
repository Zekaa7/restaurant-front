import { useEffect, useState } from "react";
import type { ModalSubmitData } from "./AdminPanel";
import DropdownField from "./DropdownField";

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

const ipaddress = "http://localhost";

const AdditemsToMenu: React.FC<AddItemToMenuProps> = ({
  isOpen,
  onClose,
  onSuccess,
  serverError,
}) => {
  const [drinks, setDrinks] = useState<DrinksProps[]>([]);
  const [glasses, setGlasses] = useState<GlassesProps[]>([]);

  // Pamti u kom tabu je bila poslednja server greška
  const [errorTab, setErrorTab] = useState<
    "meni" | "zaliha" | "obrisi" | "izmeni" | null
  >(null);

  // Zajedničko za sve tabove
  const [selectedDrink, setSelectedDrink] = useState<DrinksProps | null>(null);
  const [selectedGlass, setSelectedGlass] = useState<string | null>(null);

  // Za dodavanje novog pića
  const [inputName, setInputName] = useState("");
  const [inputVolume, setInputVolume] = useState("");

  // Za čašu
  const [inputGlass, setInputGlass] = useState("");

  // Za zalihu
  const [stockAmount, setStockAmount] = useState("");

  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "meni" | "zaliha" | "obrisi" | "izmeni"
  >("meni");
  // Učitavanje podataka
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
        console.error("Greška pri učitavanju:", err);
      }
    };

    fetchData();
  }, [isOpen]);
  console.log(serverError);
  //Na kom tabu se desila greska
  useEffect(() => {
    if (serverError) {
      setErrorTab(activeTab);
    } else {
      setErrorTab(null);
    }
  }, [serverError, activeTab]);

  // Kada korisnik promeni tab – sakrij server grešku (ona je iz starog taba)
  useEffect(() => {
    setErrorTab(null);
  }, [activeTab]);

  // Reset forme na promenu taba
  useEffect(() => {
    setError(false);
    setSelectedDrink(null);
    setSelectedGlass(null);
    setInputName("");
    setInputVolume("");
    setInputGlass("");
    setStockAmount("");
  }, [activeTab]);

  const handleSubmit = () => {
    setError(false);

    if (activeTab === "meni") {
      // Dodavanje u meni – obavezno piće i čaša
      if (
        (!selectedDrink && (!inputName.trim() || !inputVolume.trim())) ||
        (!selectedGlass && !inputGlass.trim())
      ) {
        setError(true);
        return;
      }

      const drinkData = selectedDrink
        ? { name: selectedDrink.name, volume_ml: selectedDrink.volume_ml }
        : { name: inputName.trim(), volume_ml: parseInt(inputVolume, 10) };

      const glassAmount = selectedGlass
        ? parseInt(selectedGlass, 10)
        : parseInt(inputGlass, 10);

      onSuccess({
        action: "add",
        payload: {
          first: drinkData,
          second: glassAmount,
          stock: stockAmount ? parseInt(stockAmount, 10) : undefined,
        },
      });
    } else if (activeTab === "zaliha") {
      // Dopuna zalihe – samo piće i količina obavezni
      if (!selectedDrink || !stockAmount || parseInt(stockAmount) <= 0) {
        setError(true);
        return;
      }

      onSuccess({
        action: "increment_stock",
        payload: {
          drink_id: selectedDrink.id,
          add: parseInt(stockAmount, 10),
        },
      });
    } else if (activeTab === "obrisi") {
      if (!selectedDrink) {
        setError(true);
        return;
      }

      onSuccess({
        action: "delete",
        payload: { id: selectedDrink.id },
      });
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <div className="flex flex-wrap gap-4 border-b border-gray-200 mb-6">
          <h2
            className={`text-lg font-semibold pb-2 cursor-pointer border-b-2 ${
              activeTab === "meni"
                ? "text-blue-600 border-blue-500"
                : "text-gray-500 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("meni")}
          >
            Dodaj u meni
          </h2>

          <h2
            className={`text-lg font-semibold pb-2 cursor-pointer border-b-2 ${
              activeTab === "zaliha"
                ? "text-green-600 border-green-500"
                : "text-gray-500 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("zaliha")}
          >
            Dopuni zalihu
          </h2>

          <h2
            className={`text-lg font-semibold pb-2 cursor-pointer border-b-2 ${
              activeTab === "obrisi"
                ? "text-red-600 border-red-500"
                : "text-gray-500 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("obrisi")}
          >
            Obriši piće
          </h2>

          <h2
            className={`text-lg font-semibold pb-2 cursor-pointer border-b-2 ${
              activeTab === "izmeni"
                ? "text-orange-600 border-orange-500"
                : "text-gray-500 hover:border-gray-300"
            }`}
            onClick={() => setActiveTab("izmeni")}
          >
            Izmeni piće
          </h2>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            Popuni obavezna polja.
          </p>
        )}

        {/* 1. Dodaj u meni */}
        {activeTab === "meni" && (
          <>
            <DropdownField
              label="Piće"
              options={drinks}
              selected={selectedDrink}
              setSelected={setSelectedDrink}
              inputValue={inputName}
              setInputValue={setInputName}
              inputExtraValue={inputVolume}
              setInputExtraValue={setInputVolume}
              getOptionLabel={(d) => `${d.name} ${d.volume_ml}ml`}
              getItemId={(d) => d.id}
              enableStockInput={true}
              stockInputValue={stockAmount}
              setStockInputValue={setStockAmount}
            />

            <DropdownField
              label="Čaša"
              options={glasses.map((g) => `${g.amount_ml} ml`)}
              selected={selectedGlass}
              setSelected={setSelectedGlass}
              inputValue={inputGlass}
              setInputValue={setInputGlass}
              getOptionLabel={(opt) => opt}
              casa={true}
              mode="add-to-menu"
            />
          </>
        )}

        {/* 2. Dopuni zalihu – SAMO piće i količina */}
        {activeTab === "zaliha" && (
          <DropdownField
            label="Izaberi piće za dopunu zalihe"
            options={drinks}
            selected={selectedDrink}
            setSelected={setSelectedDrink}
            getOptionLabel={(d) => `${d.name} ${d.volume_ml}ml`}
            getItemId={(d) => d.id}
            enableStockInput={true}
            stockInputValue={stockAmount}
            setStockInputValue={setStockAmount}
            mode="increment-stock"
          />
        )}

        {/* 3. Obriši */}
        {activeTab === "obrisi" && (
          <DropdownField
            label="Izaberi piće za brisanje"
            options={drinks}
            selected={selectedDrink}
            setSelected={setSelectedDrink}
            getOptionLabel={(d) => `${d.name} ${d.volume_ml}ml`}
          />
        )}

        {/* 4. Izmena */}
        {activeTab === "izmeni" && (
          <p className="text-gray-500 text-center py-8">U izradi...</p>
        )}

        <div className="mt-8 flex justify-end gap-3">
          {serverError && errorTab === activeTab && (
            <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-xl text-red-600">
              {serverError}
            </p>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Otkaži
          </button>

          <button
            onClick={handleSubmit}
            className={`px-6 py-2 rounded-md text-white font-medium ${
              activeTab === "obrisi"
                ? "bg-red-600 hover:bg-red-700"
                : activeTab === "zaliha"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {activeTab === "meni" && "Dodaj u meni"}
            {activeTab === "zaliha" && "Dopuni zalihu"}
            {activeTab === "obrisi" && "Obriši"}
            {activeTab === "izmeni" && "Sačuvaj izmene"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdditemsToMenu;
