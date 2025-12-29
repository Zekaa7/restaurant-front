import { useState } from "react";

import "./App.css";
import PinModal from "./components/PinModal";
import AdminPanel from "./components/AdminPanel";

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);

  const handleLogout = () => {
    setIsAdmin(false);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Test</h1>

          <div className="flex items-center gap-4">
            {!isAdmin && (
              <button
                onClick={() => !isAdmin && setShowPinModal(true)}
                className={`px-6 py-3 rounded-lg font-medium transition cursor-pointer ${
                  isAdmin
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-800 text-white hover:bg-gray-900"
                }`}
              >
                {isAdmin ? "Admin (Ulogovan)" : "Admin Prijava"}
              </button>
            )}

            {/* Dugme za odjavu – vidi se samo kad je admin ulogovan */}
            {isAdmin && (
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Odjavi se
              </button>
            )}
          </div>
        </div>
      </header>

      <PinModal
        isOpen={showPinModal}
        onClose={() => setShowPinModal(false)}
        onSuccess={() => {
          setIsAdmin(true);
        }}
      />

      <AdminPanel
        // isAdmin={isAdmin}
        isAdmin
      />
    </>
  );
}

export default App;
