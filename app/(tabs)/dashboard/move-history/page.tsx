"use client";

import Link from "next/link";

export default function MoveHistoryPage() {

  const history = [
    {
      id: 1,
      type: "RECEIPT",
      ref: "WH/IN/0001",
      date: "2025-01-20",
      contact: "supplier@example.com",
      from: "Supplier A",
      to: "Main Warehouse",
      quantity: 15,
      status: "DONE",
    },
    {
      id: 2,
      type: "DELIVERY",
      ref: "WH/OUT/0003",
      date: "2025-01-18",
      contact: "customer@xyz.com",
      from: "Main Warehouse",
      to: "Customer XYZ",
      quantity: 6,
      status: "READY",
    },
  ];

  return (
    <div>

      <h2 className="text-3xl font-bold mb-2">Move History</h2>
      <p className="text-gray-600 mb-8">Track all inbound and outbound operations.</p>

  
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
      
          <thead>
            <tr className="text-left text-sm border-b border-black/10">
              <th className="py-3 font-medium">Reference</th>
              <th className="py-3 font-medium">Date</th>
              <th className="py-3 font-medium">Contact</th>
              <th className="py-3 font-medium">From</th>
              <th className="py-3 font-medium">To</th>
              <th className="py-3 font-medium">Quantity</th>
              <th className="py-3 font-medium">Status</th>
              <th className="py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

  
          <tbody>
            {history.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-black/5 hover:bg-black/5 transition"
              >
                <td className="py-4 text-sm font-medium">{entry.ref}</td>
                <td className="py-4 text-sm">{entry.date}</td>
                <td className="py-4 text-sm">{entry.contact}</td>

                <td className="py-4 text-sm">{entry.from}</td>
                <td className="py-4 text-sm">{entry.to}</td>

                <td className="py-4 text-sm font-semibold">{entry.quantity}</td>

                <td className="py-4">
                  <StatusBadge status={entry.status} />
                </td>

                <td className="py-4 text-right">
                  <Link
                    href={
                      entry.type === "RECEIPT"
                        ? `/dashboard/operations/receipt/${entry.id}`
                        : `/dashboard/operations/delivery/${entry.id}`
                    }
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
    status === "DONE"
      ? "bg-green-500"
      : status === "READY"
      ? "bg-black text-white"
      : status === "LATE"
      ? "bg-red-500"
      : "bg-gray-400";

  return (
    <span
      className={`text-xs px-2 py-1 rounded-md font-semibold text-white ${color}`}
    >
      {status}
    </span>
  );
}
