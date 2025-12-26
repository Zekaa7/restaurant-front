import { useState } from "react";
import ReusableCard from "./ReusableCard";
import AdditemsToMenu from "./AdditemsToMenu";

// Definišemo tipove za različite akcije
export interface AddMenuItemPayload {
  first: {
    name: string;
    volume_ml: number;
  };
  second: number;
}

export interface DeleteMenuItemPayload {
  id: number;
}

export type ModalSubmitData =
  | { action: "add"; payload: AddMenuItemPayload }
  | { action: "delete"; payload: DeleteMenuItemPayload };

const AdminPanel = ({ isAdmin }: { isAdmin: boolean }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const clickedCardHandler = (title: string) => {
    setSelectedCard(title);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };
  const ipaddress = "http://192.168.1.160";
  // const ipaddress = "http://localhost";

  // API funkcije
  const newDrinkInMenu = async (payload: AddMenuItemPayload) => {
    const response = await fetch(`${ipaddress}/api/postRelationship`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Greška na serveru");
    return result;
  };

  const deleteDrink = async (payload: DeleteMenuItemPayload) => {
    const response = await fetch(`${ipaddress}/api/deleteDrink`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Greška na serveru");
    return result;
  };

  // Handle submit iz modalnog prozora
  const handleModalSubmit = async (data: ModalSubmitData) => {
    console.log(data);
    try {
      setIsError(false);
      setErrorMessage("");

      if (data.action === "add") {
        await newDrinkInMenu(data.payload);
      } else if (data.action === "delete") {
        await deleteDrink(data.payload);
      }

      closeModal();
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || "Došlo je do greške prilikom operacije.");
      console.error("Greška:", err);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <ReusableCard
            img="🍺"
            title="Ažuriraj meni"
            text="Dodaj, obriši ili izmeni pića u ponudi restorana."
            onClick={clickedCardHandler}
          />
          <ReusableCard
            img="📋"
            title="Pregled porudžbina"
            text="Pratite trenutne i završene porudžbine u realnom vremenu."
            onClick={clickedCardHandler}
          />
          <ReusableCard
            img="📊"
            title="Statistika i izveštaji"
            text="Analiza prodaje, najprodavanija pića i dnevni prihod."
            onClick={clickedCardHandler}
          />
        </div>
      )}

      {selectedCard === "Ažuriraj meni" && (
        <AdditemsToMenu
          isOpen={true}
          onClose={closeModal}
          onSuccess={handleModalSubmit}
          serverError={isError ? errorMessage : ""}
        />
      )}
    </main>
  );
};

export default AdminPanel;
