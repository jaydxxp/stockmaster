"use client";

import { useState, useMemo, useEffect } from "react";

import Link from "next/link";



type Warehouse = {
  id: number;
  name: string;
  shortCode: string;
  address: string;
  createdAt: string;
};

type Location = {
  id: number;
  name: string;
  shortCode: string;
  warehouseShortCode: string; 
  createdAt: string;
};

export default function SettingsPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [locations, setLocations] = useState<Location[]>([
    {
      id: 1,
      name: "Aisle 1 - Rack A",
      shortCode: "A1A",
      warehouseShortCode: "MW",
      createdAt: "2025-03-01",
    },
  ]);

  const [wName, setWName] = useState("");
  const [wCode, setWCode] = useState("");
  const [wAddress, setWAddress] = useState("");

  const [lName, setLName] = useState("");
  const [lCode, setLCode] = useState("");
  const [lWarehouse, setLWarehouse] = useState<string>("");

  const [tab, setTab] = useState<"warehouses" | "locations">("warehouses");
  const [editingWarehouseId, setEditingWarehouseId] = useState<number | null>(null);
  const [editingLocationId, setEditingLocationId] = useState<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextWarehouseId = useMemo(
    () => (warehouses.length ? Math.max(...warehouses.map((w) => w.id)) + 1 : 1),
    [warehouses]
  );
  const nextLocationId = useMemo(
    () => (locations.length ? Math.max(...locations.map((l) => l.id)) + 1 : 1),
    [locations]
  );


  useEffect(() => {
    async function loadWarehouses() {
      try {
        const res = await fetch("/api/warehouse");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const rows = await res.json();
  
        if (Array.isArray(rows) && rows.length) {
          setWarehouses(
            rows.map((r: any) => ({
              id: Number(r.id),
              name: r.name,
              shortCode: r.code ?? r.shortCode ?? "",
              address: r.location ?? r.address ?? "",
              createdAt:
                r.created_at ?? r.createdAt ?? new Date().toISOString().split("T")[0],
            }))
          );
        } else {
     
          setWarehouses([
            {
              id: 1,
              name: "Main Warehouse",
              shortCode: "MW",
              address: "123 Main St, City",
              createdAt: "2025-01-01",
            },
            {
              id: 2,
              name: "Secondary Warehouse",
              shortCode: "SW",
              address: "456 Side Rd, City",
              createdAt: "2025-02-15",
            },
          ]);
        }
      } catch (err) {
   
        console.error("Failed to load warehouses:", err);
        setWarehouses([
          {
            id: 1,
            name: "Main Warehouse",
            shortCode: "MW",
            address: "123 Main St, City",
            createdAt: "2025-01-01",
          },
          {
            id: 2,
            name: "Secondary Warehouse",
            shortCode: "SW",
            address: "456 Side Rd, City",
            createdAt: "2025-02-15",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }

    loadWarehouses();
  }, []);


  function handleAddOrUpdateWarehouse(e?: React.FormEvent) {
    e?.preventDefault();

    const trimmedCode = wCode.trim().toUpperCase();
    if (!wName.trim() || !trimmedCode) return alert("Please provide name and short code.");

    const duplicate = warehouses.find(
      (w) => w.shortCode === trimmedCode && w.id !== editingWarehouseId
    );
    if (duplicate) return alert("Short code already exists.");

    
    if (editingWarehouseId) {
      setWarehouses((prev) =>
        prev.map((w) =>
          w.id === editingWarehouseId ? { ...w, name: wName, shortCode: trimmedCode, address: wAddress } : w
        )
      );
      setEditingWarehouseId(null);
      setWName("");
      setWCode("");
      setWAddress("");
      return;
    }

   
    (async () => {
      setIsSubmitting(true);
      try {
        const payload = {
          name: wName.trim(),
          code: trimmedCode,
        
          location: wAddress.trim() || null,
        };

        const res = await fetch("/api/warehouse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error ?? `Request failed (${res.status})`);
        }

        const created = await res.json();
     
        const newWarehouse: Warehouse = {
          id: Number(created.id ?? nextWarehouseId),
          name: created.name ?? payload.name,
          shortCode: created.code ?? payload.code,
          address: created.location ?? payload.location ?? "",
          createdAt:
            created.created_at ??
            created.createdAt ??
            new Date().toISOString().split("T")[0],
        };

        setWarehouses((prev) => [...prev, newWarehouse]);
        setWName("");
        setWCode("");
        setWAddress("");
      } catch (err: any) {
        console.error("Create warehouse failed:", err);
        alert(err?.message ?? "Failed to create warehouse");
      } finally {
        setIsSubmitting(false);
      }
    })();
  }

  function handleEditWarehouse(id: number) {
    const w = warehouses.find((x) => x.id === id);
    if (!w) return;
    setWName(w.name);
    setWCode(w.shortCode);
    setWAddress(w.address);
    setEditingWarehouseId(id);
    setTab("warehouses");
  }

  function handleDeleteWarehouse(id: number) {
    if (!confirm("Delete this warehouse? This will also remove locations referencing it.")) return;
    setWarehouses((prev) => prev.filter((w) => w.id !== id));
   
    setLocations((prev) => prev.filter((l) => l.warehouseShortCode !== warehouses.find((w) => w.id === id)?.shortCode));
  }

  
  function handleAddOrUpdateLocation(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmedCode = lCode.trim().toUpperCase();
    if (!lName.trim() || !trimmedCode || !lWarehouse) return alert("Please fill all fields.");

   
    const warehouseExists = warehouses.some((w) => w.shortCode === lWarehouse);
    if (!warehouseExists) return alert("Selected warehouse does not exist.");

    
    const duplicate = locations.find(
      (l) => l.shortCode === trimmedCode && l.id !== editingLocationId
    );
    if (duplicate) return alert("Location short code already exists.");

    if (editingLocationId) {
      setLocations((prev) =>
        prev.map((l) =>
          l.id === editingLocationId
            ? { ...l, name: lName, shortCode: trimmedCode, warehouseShortCode: lWarehouse }
            : l
        )
      );
      setEditingLocationId(null);
    } else {
      setLocations((prev) => [
        ...prev,
        {
          id: nextLocationId,
          name: lName.trim(),
          shortCode: trimmedCode,
          warehouseShortCode: lWarehouse,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
    }

    setLName("");
    setLCode("");
    setLWarehouse("");
  }

  function handleEditLocation(id: number) {
    const l = locations.find((x) => x.id === id);
    if (!l) return;
    setLName(l.name);
    setLCode(l.shortCode);
    setLWarehouse(l.warehouseShortCode);
    setEditingLocationId(id);
    setTab("locations");
  }

  function handleDeleteLocation(id: number) {
    if (!confirm("Delete this location?")) return;
    setLocations((prev) => prev.filter((l) => l.id !== id));
  }


  const warehouseOptions = warehouses.map((w) => (
    <option key={w.shortCode} value={w.shortCode}>
      {w.shortCode} — {w.name}
    </option>
  ));

  return (
    <div className="pt-6 px-4">
      {isLoading ? (
        <div className="mb-6">Loading warehouses...</div>
      ) : null}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600">Manage warehouses and locations</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm text-black/70 hover:text-black">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setTab("warehouses")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            tab === "warehouses" ? "bg-black text-white" : "bg-white border border-black/10 text-black hover:bg-black/5"
          }`}
        >
          Warehouses
        </button>

        <button
          onClick={() => setTab("locations")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            tab === "locations" ? "bg-black text-white" : "bg-white border border-black/10 text-black hover:bg-black/5"
          }`}
        >
          Locations
        </button>
      </div>


      <div>
  
        {tab === "warehouses" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
            <form onSubmit={handleAddOrUpdateWarehouse} className="p-6 border border-black/10 rounded-2xl bg-white">
              <h3 className="text-lg font-bold mb-4">{editingWarehouseId ? "Edit Warehouse" : "Create Warehouse"}</h3>

              <label className="block text-sm text-gray-700">Name</label>
              <input
                value={wName}
                onChange={(e) => setWName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/20 px-4 py-2 text-black focus:border-black"
                placeholder="Warehouse name"
              />

              <label className="block text-sm text-gray-700 mt-4">Short Code</label>
              <input
                value={wCode}
                onChange={(e) => setWCode(e.target.value.toUpperCase())}
                className="mt-2 w-48 rounded-xl border border-black/20 px-4 py-2 text-black focus:border-black"
                placeholder="MW"
                maxLength={8}
              />

              <label className="block text-sm text-gray-700 mt-4">Address</label>
              <textarea
                value={wAddress}
                onChange={(e) => setWAddress(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/20 px-4 py-2 text-black focus:border-black min-h-[80px]"
                placeholder="Street, City, Postal"
              />

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/80 transition disabled:opacity-60"
                >
                  {isSubmitting ? "Saving..." : editingWarehouseId ? "Update Warehouse" : "Add Warehouse"}
                </button>
 
                {editingWarehouseId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWarehouseId(null);
                      setWName("");
                      setWCode("");
                      setWAddress("");
                    }}
                    className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/5 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>


            <div className="p-6 border border-black/10 rounded-2xl bg-white overflow-auto">
              <h3 className="text-lg font-bold mb-4">Warehouses</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-sm border-b border-black/10">
                    <th className="py-3 font-medium">Short Code</th>
                    <th className="py-3 font-medium">Name</th>
                    <th className="py-3 font-medium">Address</th>
                    <th className="py-3 font-medium">Created</th>
                    <th className="py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouses.map((w) => (
                    <tr key={w.id} className="border-b border-black/5 hover:bg-black/5 transition">
                      <td className="py-3 text-sm font-medium">{w.shortCode}</td>
                      <td className="py-3 text-sm">{w.name}</td>
                      <td className="py-3 text-sm">{w.address}</td>
                      <td className="py-3 text-sm">{w.createdAt}</td>
                      <td className="py-3 text-sm text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => handleEditWarehouse(w.id)} className="px-3 py-1 rounded-md border border-black/10 text-sm hover:bg-black/5">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteWarehouse(w.id)} className="px-3 py-1 rounded-md border border-red-200 text-sm text-red-600 hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}


        {tab === "locations" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       
            <form onSubmit={handleAddOrUpdateLocation} className="p-6 border border-black/10 rounded-2xl bg-white">
              <h3 className="text-lg font-bold mb-4">{editingLocationId ? "Edit Location" : "Create Location"}</h3>

              <label className="block text-sm text-gray-700">Name</label>
              <input
                value={lName}
                onChange={(e) => setLName(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/20 px-4 py-2 text-black focus:border-black"
                placeholder="Aisle / Rack / Zone"
              />

              <label className="block text-sm text-gray-700 mt-4">Short Code</label>
              <input
                value={lCode}
                onChange={(e) => setLCode(e.target.value.toUpperCase())}
                className="mt-2 w-48 rounded-xl border border-black/20 px-4 py-2 text-black focus:border-black"
                placeholder="A1B"
                maxLength={8}
              />

              <label className="block text-sm text-gray-700 mt-4">Warehouse (by short code)</label>
              <select
                value={lWarehouse}
                onChange={(e) => setLWarehouse(e.target.value)}
                className="mt-2 w-full rounded-xl border border-black/20 px-4 py-2 text-black focus:border-black"
              >
                <option value="">Select warehouse</option>
                {warehouseOptions}
              </select>

              <div className="mt-6 flex gap-3">
                <button type="submit" className="px-4 py-2 rounded-lg bg-black text-white hover:bg-black/80 transition">
                  {editingLocationId ? "Update Location" : "Add Location"}
                </button>

                {editingLocationId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLocationId(null);
                      setLName("");
                      setLCode("");
                      setLWarehouse("");
                    }}
                    className="px-4 py-2 rounded-lg border border-black/10 hover:bg-black/5 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

  
            <div className="p-6 border border-black/10 rounded-2xl bg-white overflow-auto">
              <h3 className="text-lg font-bold mb-4">Locations</h3>

              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-left text-sm border-b border-black/10">
                    <th className="py-3 font-medium">Short Code</th>
                    <th className="py-3 font-medium">Name</th>
                    <th className="py-3 font-medium">Warehouse</th>
                    <th className="py-3 font-medium">Created</th>
                    <th className="py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {locations.map((l) => (
                    <tr key={l.id} className="border-b border-black/5 hover:bg-black/5 transition">
                      <td className="py-3 text-sm font-medium">{l.shortCode}</td>
                      <td className="py-3 text-sm">{l.name}</td>
                      <td className="py-3 text-sm">{l.warehouseShortCode}</td>
                      <td className="py-3 text-sm">{l.createdAt}</td>
                      <td className="py-3 text-sm text-right">
                        <div className="inline-flex gap-2">
                          <button onClick={() => handleEditLocation(l.id)} className="px-3 py-1 rounded-md border border-black/10 text-sm hover:bg-black/5">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteLocation(l.id)} className="px-3 py-1 rounded-md border border-red-200 text-sm text-red-600 hover:bg-red-50">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
