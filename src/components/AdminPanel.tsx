import { useState } from "react";
import ReusableCard from "./ReusableCard";
import AdditemsToMenu from "./AdditemsToMenu";
import Orders from "./Orders";
import type { ModalSubmitData } from "../helper";
import { newDrinkInMenu, incrementStock, deleteDrink } from "../helper";
import TableIcon from "../assets/icons/table_restaurant.svg";
import TableManagment from "./Tables/TableManagment";

const PANEL_CARDS = ["Pregled porudžbina", "Statistika i izveštaji", "Stolovi"];

const AdminPanel = ({ isAdmin }: { isAdmin: boolean }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const clickedCardHandler = (title: string) => {
    setSelectedCard((prev) => (prev === title ? null : title));
  };
  const closeView = () => {
    setSelectedCard(null);
  };
  // Handle submit iz modalnog prozora
  const handleModalSubmit = async (data: ModalSubmitData) => {
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
      }

      if (data.action === "increment_stock") {
        const { drink_id, add } = data.payload;
        await incrementStock(drink_id, add);
      }

      if (data.action === "delete") {
        await deleteDrink(data.payload);
      }

      closeView();
    } catch (err: any) {
      setIsError(true);
      setErrorMessage(err.message || "Došlo je do greške.");
      console.error(err);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 space-y-12">
      {/* ACTION CARDS */}

      <section>
        <h2 className="mb-6 text-2xl font-semibold text-gray-900">
          {isAdmin ? "Admin Panel" : "Pregled porudžbina"}
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <ReusableCard
            img="📋"
            title="Pregled porudžbina"
            text="Pratite trenutne i završene porudžbine u realnom vremenu."
            onClick={clickedCardHandler}
          />
          {isAdmin && (
            <>
              <ReusableCard
                img="🍺"
                title="Ažuriraj meni"
                text="Dodaj, obriši ili izmeni pića u ponudi restorana."
                onClick={clickedCardHandler}
              />

              <ReusableCard
                img="📊"
                title="Statistika i izveštaji"
                text="Analiza prodaje, najprodavanija pića i dnevni prihod."
                onClick={clickedCardHandler}
              />
            </>
          )}

          <ReusableCard
            img={
              <img
                src={TableIcon}
                alt="Stolovi"
                className="w-14 h-18 mx-auto"
                style={{
                  filter:
                    "invert(26%) sepia(51%) saturate(2872%) hue-rotate(347deg) brightness(94%) contrast(90%)", // ≈ #8B4513 saddlebrown
                }}
              />
            }
            title="Stolovi"
            text="Pregled i upravljanje stolovima."
            onClick={clickedCardHandler}
          />
        </div>
      </section>

      {/* MODAL — samo za Ažuriraj meni */}
      {selectedCard === "Ažuriraj meni" && (
        <AdditemsToMenu
          isOpen
          onClose={closeView}
          onSuccess={handleModalSubmit}
          serverError={isError ? errorMessage : ""}
        />
      )}

      {/* CONTENT PANEL — samo za panel kartice */}
      {PANEL_CARDS.includes(selectedCard ?? "") && (
        <section className="rounded-3xl bg-gray-50 p-8 shadow-inner space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {selectedCard}
            </h3>

            {/* <button
              onClick={closeView}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Zatvori
            </button> */}
          </div>

          <div className="h-px bg-gray-200" />

          {selectedCard === "Pregled porudžbina" && <Orders />}

          {selectedCard === "Statistika i izveštaji" && (
            <div className="text-gray-500">Statistika u pripremi…</div>
          )}
          {selectedCard === "Stolovi" && <TableManagment />}
        </section>
      )}
    </main>
  );
};

export default AdminPanel;
