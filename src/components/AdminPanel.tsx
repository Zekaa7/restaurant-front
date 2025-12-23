import { useState } from "react";
import ReusableCard from "./ReusableCard";
import AdditemsToMenu from "./AdditemsToMenu";

export interface MenuItemData {
  first: {
    name: string;
    volume_ml: number;
  };
  second: number;
}

const AdminPanel = ({ isAdmin }: { isAdmin: boolean }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const clickedCardHandler = (title: string) => {
    setSelectedCard(title);
  };
  const closeModal = () => {
    setSelectedCard(null);
  };

  const handleModalSubmit = (data: any) => {
    console.log("PODACI IZ MODALA", data);
    closeModal();
  };
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Kartica 1: Ažuriraj meni */}

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
        />
      )}
    </main>
  );
};

export default AdminPanel;
