import React from "react";

const AdminPanel = ({ isAdmin }: { isAdmin: boolean }) => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Kartica 1: Ažuriraj meni */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow cursor-pointer border-2 border-blue-200">
            <div className="text-5xl mb-4 text-center">🍺</div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-3">
              Ažuriraj meni
            </h3>
            <p className="text-center text-gray-600">
              Dodaj, obriši ili izmeni pića u ponudi restorana.
            </p>
          </div>

          {/* Kartica 2: Pregled porudžbina */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow cursor-pointer border-2 border-gray-200">
            <div className="text-5xl mb-4 text-center">📋</div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-3">
              Pregled porudžbina
            </h3>
            <p className="text-center text-gray-600">
              Pratite trenutne i završene porudžbine u realnom vremenu.
            </p>
          </div>

          {/* Kartica 3: Statistika i izveštaji */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-shadow cursor-pointer border-2 border-gray-200">
            <div className="text-5xl mb-4 text-center">📊</div>
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-3">
              Statistika i izveštaji
            </h3>
            <p className="text-center text-gray-600">
              Analiza prodaje, najprodavanija pića i dnevni prihod.
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPanel;
