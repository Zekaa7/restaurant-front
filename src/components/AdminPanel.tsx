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
  stock?: number;
}

export interface DeleteMenuItemPayload {
  id: number;
}
export interface IncrementStockPayload {
  drink_id: number;
  add: number; // koliko dodati na trenutnu zalihu
}
export type ModalSubmitData =
  | { action: "add"; payload: AddMenuItemPayload }
  | { action: "delete"; payload: DeleteMenuItemPayload }
  | { action: "increment_stock"; payload: IncrementStockPayload };

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
  // const ipaddress = "http://192.168.1.160";
  const ipaddress = "http://localhost:3001";

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

  // const updateStock = async (drink_id: number, quantity: number) => {
  //   const response = await fetch(`${ipaddress}/api/update-stock`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ drink_id, quantity }),
  //   });
  //   if (!response.ok) {
  //     const err = await response.json();
  //     console.warn("Greška pri ažuriranju zalihe:", err);
  //     return false;
  //   }
  //   return true;
  // };

  const incrementStock = async (drink_id: number, add: number) => {
    const response = await fetch(`${ipaddress}/api/increment-stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ drink_id, add }),
    });
    if (!response.ok) {
      const err = await response.json();
      console.warn("Greška pri dopuni zalihe:", err);
      return false;
    }
    return true;
  };

  // Handle submit iz modalnog prozora
  const handleModalSubmit = async (data: ModalSubmitData) => {
    console.log(data);
    try {
      setIsError(false);
      setErrorMessage("");

      if (data.action === "add") {
        const { first, second, stock } = data.payload;
        const menuResult = await newDrinkInMenu({ first, second });
        const drinkId = menuResult.drink_id;

        if (stock !== undefined && stock >= 0) {
          await incrementStock(drinkId, stock);
        }
      } else if (data.action === "increment_stock") {
        const { drink_id, add } = data.payload;
        await incrementStock(drink_id, add); // ← OVDE SE POZIVA!
      } else if (data.action === "delete") {
        await deleteDrink(data.payload);
      }

      closeModal();
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || "Došlo je do greške.");
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
