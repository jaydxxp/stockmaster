"use client";

import { useState } from "react";
import Link from "next/link";

export default function DeliveryPage() {
  const [search, setSearch] = useState("");

 
  const deliveries = [
    {
      id: 1,
      externalRef: "DLV-33421",
      from: "Main Warehouse",
      to: "Customer XYZ",
      contact: "xyz@example.com",
      date: "2025-01-22",
      status: "READY",
    },
    {
      id: 2,
      externalRef: "DLV-22117",
      from: "Warehouse B",
      to: "Customer ABC",
      contact: "abc@supply.com",
      date: "2025-01-19",
      status: "LATE",
    },
  ];

  return (
    <div>
     
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold">Deliveries</h2>
          <p className="text-gray-600 mt-1">Manage all outgoing delivery operations</p>
        </div>

        
        <Link
          href="/dashboard/operations/delivery/new"
          className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-black/80 transition"
        >
          + New Delivery
        </Link>
      </div>


      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search delivery reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border border-black/20 bg-white px-4 py-2.5 placeholder:text-gray-400 text-black text-sm focus:border-black focus:outline-none transition"
        />

        <select className="rounded-xl border border-black/20 bg-white px-4 py-2.5 text-sm text-black focus:border-black focus:outline-none">
          <option value="">All Status</option>
          <option value="WAITING">Waiting</option>
          <option value="READY">Ready</option>
          <option value="DONE">Done</option>
          <option value="LATE">Late</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm border-b border-black/10">
              <th className="py-3 font-medium">Reference</th>
              <th className="py-3 font-medium">From</th>
              <th className="py-3 font-medium">To</th>
              <th className="py-3 font-medium">Contact</th>
              <th className="py-3 font-medium">Schedule Date</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id} className="border-b border-black/5 hover:bg-black/5 transition cursor-pointer">
                <td className="py-4 text-sm font-medium">{d.externalRef}</td>
                <td className="py-4 text-sm">{d.from}</td>
                <td className="py-4 text-sm">{d.to}</td>
                <td className="py-4 text-sm">{d.contact}</td>
                <td className="py-4 text-sm">{d.date}</td>
                <td className="py-4">
                  <StatusBadge status={d.status} />
                </td>
                <td className="py-4 text-right">
                  <Link
                    href={`/dashboard/operations/delivery/${d.id}`}
                    className="text-sm text-black underline underline-offset-2 hover:opacity-70"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "LATE"
      ? "bg-red-500"
      : status === "READY"
      ? "bg-black text-white"
      : status === "DONE"
      ? "bg-green-500"
      : "bg-gray-400";

  return (
    <span className={`text-xs px-2 py-1 rounded-md font-semibold text-white ${color}`}>
      {status}
    </span>
  );
}
