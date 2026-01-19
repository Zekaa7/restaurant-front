import type { Table, TableStatus } from "./components/Tables/TableManagment";

// export const ipaddress = "http://192.168.1.160";
export const ipaddress = "http://localhost:3001";
export const ipHome = "http://100.101.166.18:8000";
// export const ipHome = "http://100.83.234.45:8000";

export type ModalSubmitData =
  | { action: "add"; payload: AddMenuItemPayload }
  | { action: "delete"; payload: DeleteMenuItemPayload }
  | { action: "increment_stock"; payload: IncrementStockPayload };

export const getStatusLabel = (status: Table["status"]) => {
  switch (status) {
    case "FREE":
      return "Slobodan";
    case "OCCUPIED":
      return "Zauzet";
    case "RESERVED":
      return "Rezervisan";
    case "NOTINUSE":
      return "Van upotrebe";
    default:
      return "Nepoznat";
  }
};
export const getStatusColor = (status: Table["status"]) => {
  switch (status) {
    case "FREE":
      return "bg-emerald-600 hover:bg-emerald-700";
    case "OCCUPIED":
      return "bg-rose-600 hover:bg-rose-700";
    case "RESERVED":
      return "bg-indigo-600 hover:bg-indigo-700";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};
export const getStatusStyles = (status: TableStatus) => {
  switch (status) {
    case "FREE":
      return {
        bg: "bg-emerald-500 hover:bg-emerald-600",
        text: "text-white",
        indicator: "bg-emerald-700",
        label: "Slobodan",
      };
    case "OCCUPIED":
      return {
        bg: "bg-rose-500 hover:bg-rose-600",
        text: "text-white",
        indicator: "bg-rose-700",
        label: "Zauzet",
      };
    case "RESERVED":
      return {
        bg: "bg-indigo-500 hover:bg-indigo-600",
        text: "text-white",
        indicator: "bg-indigo-700",
        label: "Rezervisan",
      };
    case "NOTINUSE":
      return {
        bg: "bg-gray-400 hover:bg-gray-500",
        text: "text-white",
        indicator: "bg-gray-600",
        label: "Van upotrebe",
      };
    default:
      return { bg: "", text: "", indicator: "", label: "" };
  }
};
export function formatDateTime(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year}. ${hours}:${minutes}`;
}
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

// API funkcije
export const newDrinkInMenu = async (payload: AddMenuItemPayload) => {
  const response = await fetch(`${ipaddress}/api/postRelationship`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Greška na serveru");
  return result;
};

export const deleteDrink = async (payload: DeleteMenuItemPayload) => {
  const response = await fetch(`${ipaddress}/api/deleteDrink`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Greška na serveru");
  return result;
};

export const incrementStock = async (drink_id: number, add: number) => {
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
