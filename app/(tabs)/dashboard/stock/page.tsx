"use client";

import { useState } from "react";

export default function StockPage() {
  const [search, setSearch] = useState("");


  const stockList = [
    {
      id: 1,
      product: "iPhone 15 Pro",
      cost: 1200,
      onHand: 42,
      free: 38,
      category: "Electronics",
    },
    {
      id: 2,
      product: "AirPods Max",
      cost: 499,
      onHand: 20,
      free: 18,
      category: "Accessories",
    },
    {
      id: 3,
      product: "MacBook Pro M3",
      cost: 2500,
      onHand: 10,
      free: 9,
      category: "Electronics",
    },
  ];

  return (
    <div>

      <h2 className="text-3xl font-bold mb-2">Stock Overview</h2>
      <p className="text-gray-600 mb-8">Current stock availability and unit costs.</p>

    
      <div className="flex flex-col md:flex-row gap-4 mb-8">

       
        <input
          type="text"
          placeholder="Search product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            flex-1 rounded-xl border border-black/20 bg-white px-4 py-2.5
            placeholder:text-gray-400 text-black text-sm
            focus:border-black focus:outline-none transition
          "
        />

    
        <select
          className="
            rounded-xl border border-black/20 bg-white px-4 py-2.5 text-sm text-black
            focus:border-black focus:outline-none transition
          "
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Accessories">Accessories</option>
          <option value="Hardware">Hardware</option>
        </select>
      </div>

      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm border-b border-black/10">
              <th className="py-3 font-medium">Product</th>
              <th className="py-3 font-medium">Per Unit Cost</th>
              <th className="py-3 font-medium">On Hand</th>
              <th className="py-3 font-medium">Free To Use</th>
             
            </tr>
          </thead>

          <tbody>
            {stockList.map((item) => (
              <tr
                key={item.id}
                className="border-b border-black/5 hover:bg-black/5 transition"
              >
                <td className="py-4 text-sm font-medium">{item.product}</td>
                <td className="py-4 text-sm">$ {item.cost}</td>
                <td className="py-4 text-sm font-semibold">{item.onHand}</td>
                <td className="py-4 text-sm font-semibold">{item.free}</td>
            
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
