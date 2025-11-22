"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NewReceipt() {
  const router = useRouter();
  const { data: session } = useSession();
  const loggedInUser = session?.user?.name ?? session?.user?.loginId ?? "Unknown User";
  const loggedInUserId = session?.user?.id ? Number(session.user.id) : null;

  const [status, setStatus] = useState<"DRAFT" | "READY" | "DONE">("DRAFT");
  const [products, setProducts] = useState<{ product: string; quantity: number }[]>([
    { product: "", quantity: 1 },
  ]);
  const [toWarehouseId, setToWarehouseId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddProduct = () => {
    setProducts([...products, { product: "", quantity: 1 }]);
  };

  const handleProductChange = (idx: number, field: "product" | "quantity", value: string) => {
    setProducts((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, [field]: field === "quantity" ? Number(value) : value } : p
      )
    );
  };

  const handleRemoveProduct = (idx: number) => {
    setProducts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    const twId = Number(toWarehouseId);
    if (!twId || isNaN(twId)) {
      setError("Please provide a valid destination warehouse id.");
      return;
    }

    const itemsPayload: { productId: number; quantity: number; notes: string | null }[] = [];
    for (const p of products) {
      const pid = Number(p.product);
      if (!pid || isNaN(pid)) {
        setError("Each product must be a numeric product id.");
        return;
      }
      if (!p.quantity || p.quantity <= 0) {
        setError("Each product must have a positive quantity.");
        return;
      }
      itemsPayload.push({ productId: pid, quantity: Number(p.quantity), notes: null });
    }

    if (!loggedInUserId) {
      setError("You must be signed in to create a receipt.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/receipts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          toWarehouseId: twId,
          items: itemsPayload,
          notes: notes || null,
   
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Request failed (${res.status})`);
      }

      const data = await res.json();
      router.push("/dashboard/operations/receipt");
    } catch (err: any) {
      console.error("Create receipt failed:", err);
      setError(err?.message ?? "Failed to create receipt");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/dashboard/operations/receipt"
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 transition text-sm"
        >
          Back
        </Link>

        <h2 className="text-3xl font-bold text-black">Receipt</h2>

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

      <div className="mb-8">
        <span className="px-4 py-1 text-sm rounded-full bg-gray-300 text-black">{status}</span>
      </div>

      <form className="border border-black/10 rounded-2xl p-6 bg-white" onSubmit={handleSubmit}>
        <h3 className="text-xl font-bold mb-6">WH/IN/0001</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm text-gray-700">Receive To (warehouse id)</label>
            <input
              value={toWarehouseId}
              onChange={(e) => setToWarehouseId(e.target.value)}
              type="number"
              placeholder="Destination warehouse id"
              className="mt-2 w-full border border-black/20 rounded-xl px-4 py-2.5 placeholder:text-gray-400 focus:border-black text-black"
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Schedule Date</label>
            <input
              type="date"
              className="mt-2 w-full border border-black/20 rounded-xl px-4 py-2.5 focus:border-black text-black"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Responsible</label>
            <input
              type="text"
              readOnly
              value={loggedInUser}
              className="mt-2 w-full border border-black/20 rounded-xl px-4 py-2.5 bg-gray-100 text-black"
            />
          </div>
        </div>

        <h3 className="text-lg font-bold mb-3">Products</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm border-b border-black/10">
              <th className="py-3 font-medium">Product (id)</th>
              <th className="py-3 font-medium">Quantity</th>
              <th className="py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b border-black/5">
                <td className="py-4">
                  <input
                    type="text"
                    placeholder="Product ID (numeric)"
                    value={p.product}
                    onChange={(e) => handleProductChange(i, "product", e.target.value)}
                    className="w-full border border-black/20 rounded-lg px-3 py-2 placeholder:text-gray-400 text-black focus:border-black"
                    required
                  />
                </td>
                <td className="py-4">
                  <input
                    type="number"
                    min="1"
                    value={p.quantity}
                    onChange={(e) => handleProductChange(i, "quantity", e.target.value)}
                    className="w-24 border border-black/20 rounded-lg px-3 py-2 text-black focus:border-black"
                    required
                  />
                </td>
                <td className="py-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(i)}
                    className="px-3 py-1 text-sm border rounded-lg hover:bg-black/5 transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={handleAddProduct}
            className="border border-black text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition"
          >
            + Add Product
          </button>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full border border-black/20 rounded-lg px-3 py-2 text-black focus:border-black"
          />
        </div>

        {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard/operations/receipt")}
            className="px-4 py-2 border border-black rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/80 transition disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Create Receipt"}
          </button>
        </div>
      </form>
    </div>
  );
}
