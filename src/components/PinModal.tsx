// import process from "process";
import React, { useState } from "react";
import { ipHome } from "../helper";

const pin = "2850";

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
}

const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(`${ipHome}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      if (!response.ok) {
        throw new Error("Neispravni kredencijali");
      }
      const data = await response.json();

      localStorage.setItem("access_token", data.access_token);

      onSuccess(data.access_token);
      setUsername("");
      setPassword("");
    } catch (error) {
      setError("Pogrešno korisničko ime ili lozinka");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUsername("");
    setPassword("");
    setError(null);
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
            type="text"
            placeholder="Korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4"
            required
          />

          <input
            type="password"
            placeholder="Lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg mb-4"
            required
          />

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center font-medium">
              {error}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Prijava..." : "Prijavi se"}
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
