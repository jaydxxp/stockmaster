"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ReceiptPage() {
  const [search, setSearch] = useState("");
  const [receipts, setReceipts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/receipts");
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? `Request failed (${res.status})`);
        }
        const data = await res.json();
        if (!mounted) return;
        
        const normalized = (Array.isArray(data) ? data : []).map((r: any) => ({
          id: r.id,
          externalRef: r.external_ref ?? r.externalRef ?? r.reference ?? `WH/${r.id}`,
          from: r.from_name ?? r.from ?? r.source ?? "—",
          to: r.to_name ?? r.to ?? r.destination ?? "—",
          contact: r.contact ?? "—",
          date:
            r.schedule_date ??
            r.created_at ??
            r.createdAt ??
            (r.created_at_iso ? new Date(r.created_at_iso).toISOString().split("T")[0] : "—"),
          status: r.status ?? "DRAFT",
        }));
        setReceipts(normalized.length ? normalized : []);
      } catch (err: any) {
        console.error("Failed to load receipts:", err);
        if (mounted) setError(err?.message ?? "Failed to load receipts");
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);


  const displayReceipts = receipts.length
    ? receipts
    : [
        {
          id: 1,
          externalRef: "PO-45322",
          from: "Supplier A",
          to: "Main Warehouse",
          contact: "supplier@example.com",
          date: "2025-01-21",
          status: "WAITING",
        },
      ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold">Receipts</h2>
          <p className="text-gray-600 mt-1">Manage all incoming receipt operations</p>
        </div>

        {/* NEW RECEIPT BUTTON */}
        <Link
          href="/dashboard/operations/receipt/new"
          className="
            bg-black text-white px-5 py-2.5 rounded-xl text-sm font-medium
            hover:bg-black/80 transition
          "
        >
          + New Receipt
        </Link>
      </div>

      {/* SEARCH + FILTER ROW */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search receipt reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="
            flex-1 rounded-xl border border-black/20 bg-white px-4 py-2.5
            placeholder:text-gray-400 text-black text-sm
            focus:border-black focus:outline-none transition
          "
        />

        {/* FILTER DROPDOWN */}
        <select
          className="
            rounded-xl border border-black/20 bg-white px-4 py-2.5 text-sm text-black
            focus:border-black focus:outline-none transition
          "
        >
          <option value="">All Status</option>
          <option value="WAITING">Waiting</option>
          <option value="READY">Ready</option>
          <option value="DONE">Done</option>
          <option value="LATE">Late</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {isLoading && <div className="mb-4 text-sm text-gray-600">Loading receipts...</div>}
      {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

      {/* TABLE */}
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
            {displayReceipts
              .filter((r) => (search ? String(r.externalRef).toLowerCase().includes(search.toLowerCase()) : true))
              .map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-black/5 hover:bg-black/5 transition cursor-pointer"
                >
                  <td className="py-4 text-sm font-medium">{r.externalRef}</td>
                  <td className="py-4 text-sm">{r.from}</td>
                  <td className="py-4 text-sm">{r.to}</td>
                  <td className="py-4 text-sm">{r.contact}</td>
                  <td className="py-4 text-sm">{r.date}</td>

                  {/* STATUS BADGE */}
                  <td className="py-4">
                    <StatusBadge status={r.status} />
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 text-right">
                    <Link
                      href={`/dashboard/operations/receipt/${r.id}`}
                      className="
                        text-sm text-black underline underline-offset-2 
                        hover:opacity-70 transition
                      "
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

/* STATUS BADGE COMPONENT */
function StatusBadge({ status }: { status: string }) {
  const color =
    status === "LATE"
      ? "bg-red-500"
      : status === "WAITING"
      ? "bg-yellow-400"
      : status === "DONE"
      ? "bg-green-500"
      : "bg-black/40";

  return (
    <span
      className={`
        text-xs text-white px-2 py-1 rounded-md font-semibold
        ${color}
      `}
    >
      {status}
    </span>
  );
}
