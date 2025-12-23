// import process from "process";
import React, { use, useState } from "react";

const pin = "2850";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [pinInput, setPinInput] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pinInput === pin) {
      onSuccess();
      setPinInput("");
      setError(false);
      onClose();
    } else {
      setError(true);
      setPinInput("");
    }
  };

  const handleClose = () => {
    setPinInput("");
    setError(false);
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Prijava
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Unesi PIN"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            autoFocus
          />

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center font-medium">
              Pogrešan PIN!
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Potvrdi
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-400 transition"
            >
              Otkaži
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PinModal;
