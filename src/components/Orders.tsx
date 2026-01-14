import React from 'react'

const orders = [
  {
    id: "A4",
    name: "Ariel Hikmat",
    status: "Ready",
    type: "Dine In",
    // date: "Wed, July 12, 2023",
    items: [
      { name: "Scrambled eggs with toast", qty: 2, price: 16.99 },
      { name: "Smoked Salmon Bagel", qty: 1, price: 18.49 },
      { name: "Belgian Waffles", qty: 1, price: 38.98 },
    ],
    total: 87.34,
  },
  {
    id: "B2",
    name: "Denis Freeman",
    status: "In Process",
    type: "Dine In",
    // date: "Wed, July 12, 2023",
    items: [
      { name: "Classic Cheeseburger", qty: 1, price: 10.99 },
      { name: "Fish and Chips", qty: 2, price: 34.00 },
    ],
    total: 57.87,
  },
    {
    id: "A5",
    name: "Ariel Hikmat",
    status: "Ready",
    type: "Dine In",
    // date: "Wed, July 12, 2023",
    items: [
      { name: "Scrambled eggs with toast", qty: 2, price: 16.99 },
      { name: "Smoked Salmon Bagel", qty: 1, price: 18.49 },
      { name: "Belgian Waffles", qty: 1, price: 38.98 },
    ],
    total: 87.34,
  },
    {
    id: "A6",
    name: "Ariel Hikmat",
    status: "Ready",
    type: "Dine In",
    // date: "Wed, July 12, 2023",
    items: [
      { name: "Scrambled eggs with toast", qty: 2, price: 16.99 },
      { name: "Smoked Salmon Bagel", qty: 1, price: 18.49 },
      { name: "Belgian Waffles", qty: 1, price: 38.98 },
    ],
    total: 87.34,
  },
];

const Orders = () => {
  return (
   <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
  {orders.map((order) => (
    <div
      key={order.id}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:shadow-xl border-2 border-purple-300 "
    >
      {/* Header sa brojem stola i statusom */}
      <div className="flex items-center justify-between border-b border-gray-100 p-5">
        <div className="flex items-center gap-4">
          {/* Veliki krug sa brojem stola */}
          <div className={`flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg ${
            order.status === "Ready" ? "bg-emerald-500" : "bg-amber-500"
          }`}>
            {order.id}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900">{order.name}</h3>
            {/* <p className="text-sm text-gray-500">{order.date}</p> */}
          </div>
        </div>

        {/* Status badge sa ikonom */}
        <div className={`flex items-center gap-2 rounded-full px-2 py-2 text-sm font-medium ${
          order.status === "Ready"
            ? "bg-emerald-100 text-emerald-800"
            : "bg-amber-100 text-amber-800"
        }`}>
          {order.status === "Ready" ? (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" />
            </svg>
          )}
          {order.status}
        </div>
      </div>

      {/* Lista pića */}
      <div className="p-5">
        <div className="space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{item.qty}×</span>
                <span className="text-gray-700">{item.name}</span>
              </div>
              <span className="font-medium text-gray-900">
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer – total i dugmad */}
      <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Ukupno</span>
          <span className="text-2xl font-bold text-gray-900">
            {order.total.toFixed(2)} RSD
          </span>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 cursor-pointer">
            Pogledaj detalje
          </button>
          {/* <button className="flex-1 rounded-xl bg-yellow-400 px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-yellow-500">
            Pay Bill
          </button> */}
        </div>
      </div>
    </div>
  ))}
</div>
  )
}

export default Orders
