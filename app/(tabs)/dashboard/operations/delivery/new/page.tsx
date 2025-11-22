"use client";

import { useState } from "react";

export default function NewDelivery() {
  const [status, setStatus] = useState<"DRAFT" | "READY" | "DONE">("DRAFT");
  const [products, setProducts] = useState([{ product: "", quantity: 1 }]);

  const loggedInUser = "John Doe";

  const addProduct = () => {
    setProducts([...products, { product: "", quantity: 1 }]);
  };

  return (
    <div>

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-bold text-black">Delivery</h2>

        <div className="flex gap-3">
          {status === "DRAFT" && (
            <button
              onClick={() => setStatus("READY")}
              className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
            >
              To Do
            </button>
          )}

          {status === "READY" && (
            <button
              onClick={() => setStatus("DONE")}
              className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition"
            >
              Validate
            </button>
          )}

          {status === "DONE" && (
            <button className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition">
              Print
            </button>
          )}

          <button className="px-4 py-2 border border-black rounded-lg hover:bg-black hover:text-white transition">
            Cancel
          </button>
        </div>
      </div>

      <div className="mb-6">
        <span
          className={`px-4 py-1 rounded-full text-sm 
            ${
              status === "DRAFT"
                ? "bg-gray-300 text-black"
                : status === "READY"
                ? "bg-black text-white"
                : "bg-green-500 text-white"
            }`}
        >
          {status}
        </span>
      </div>

      <div className="border border-black/10 rounded-2xl p-6 bg-white">
        <h3 className="text-xl font-bold mb-6">WH/OUT/0001</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

      
          <div>
            <label className="text-sm text-gray-700">Operation Type</label>
            <select
              className="
                mt-2 w-full border border-black/20 rounded-xl px-4 py-2.5
                text-black bg-white focus:border-black outline-none
              "
              defaultValue="DELIVERY"
            >
              <option value="DELIVERY">Delivery</option>
              <option value="TRANSFER">Transfer</option>
              <option value="ADJUSTMENT">Adjustment</option>
            </select>
          </div>

         
          <div>
            <label className="text-sm text-gray-700">Delivery Address</label>
            <input
              type="text"
              placeholder="Customer delivery address"
              className="
                mt-2 w-full border border-black/20 rounded-xl px-4 py-2.5 
                placeholder:text-gray-400 focus:border-black text-black
              "
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Schedule Date</label>
            <input
              type="date"
              className="
                mt-2 w-full border border-black/20 rounded-xl px-4 py-2.5 
                focus:border-black text-black
              "
            />
          </div>

          
          <div>
            <label className="text-sm text-gray-700">Responsible</label>
            <input
              type="text"
              readOnly
              value={loggedInUser}
              className="
                mt-2 w-full border border-black/20 rounded-xl px-4 py-2.5 
                bg-gray-100 text-black
              "
            />
          </div>
        </div>

        
        <h3 className="text-lg font-bold mb-3">Products</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm border-b border-black/10">
              <th className="py-3 font-medium">Product</th>
              <th className="py-3 font-medium">Quantity</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b border-black/5">
                <td className="py-4">
                  <input
                    type="text"
                    placeholder="Product Name / SKU"
                    className="
                      w-full border border-black/20 rounded-lg px-3 py-2 
                      placeholder:text-gray-400 text-black focus:border-black
                    "
                  />
                </td>
                <td className="py-4">
                  <input
                    type="number"
                    min="1"
                    defaultValue={p.quantity}
                    className="
                      w-24 border border-black/20 rounded-lg px-3 py-2 
                      text-black focus:border-black
                    "
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      
        <button
          onClick={addProduct}
          className="mt-4 border border-black text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition"
        >
          + Add Product
        </button>
      </div>
    </div>
  );
}
