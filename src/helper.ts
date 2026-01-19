// export const ipaddress = "http://192.168.1.160";
export const ipaddress = "http://localhost:3001";

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
