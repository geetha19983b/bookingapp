import React, { useState } from "react";

const initialState = {
  type: "Goods",
  name: "",
  sku: "",
  unit: "",
  hsn: "",
  taxPreference: "Taxable",
  unit2: "",
  sellable: true,
  purchasable: true,
  sellingPrice: "",
  salesAccount: "Sales",
  salesDescription: "",
  costPrice: "",
  purchaseAccount: "Cost of Goods Sold",
  purchaseDescription: "",
  preferredVendor: "",
  trackInventory: false,
};

export default function NewItemForm({ onSave }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      // Dummy backend call
      const res = await fetch("http://localhost:5174/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSuccess("Item saved!");
      if (onSave) onSave();
      setForm(initialState);
    } catch (err) {
      setError("Failed to save item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-white rounded shadow p-8">
      <h2 className="text-2xl font-semibold mb-6">New Item</h2>
      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-6 mb-2">
            <label className="font-medium">Type</label>
            <label className="flex items-center gap-1">
              <input type="radio" name="type" value="Goods" checked={form.type === "Goods"} onChange={handleChange} className="accent-blue-600" /> Goods
            </label>
            <label className="flex items-center gap-1">
              <input type="radio" name="type" value="Service" checked={form.type === "Service"} onChange={handleChange} className="accent-blue-600" /> Service
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Name<span className="text-red-500">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium">SKU</label>
              <input name="sku" value={form.sku} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Unit</label>
              <select name="unit" value={form.unit} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
                <option value="">--Select--</option>
                <option value="Nos">Nos</option>
                <option value="Kg">Kg</option>
                <option value="Litre">Litre</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">HSN Code</label>
              <input name="hsn" value={form.hsn} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Tax Preference <span className="text-red-500">*</span></label>
              <select name="taxPreference" value={form.taxPreference} onChange={handleChange} className="mt-1 w-full border rounded px-3 py-2">
                <option value="Taxable">Taxable</option>
                <option value="Non-Taxable">Non-Taxable</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Unit <span className="text-red-500">*</span></label>
            <input name="unit2" value={form.unit2} onChange={handleChange} required className="mt-1 w-full border rounded px-3 py-2" />
          </div>
        </div>
        {/* Image upload */}
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded h-48">
          <span className="text-gray-400 mb-2">Drag image(s) here or</span>
          <button type="button" className="text-blue-600 underline">Browse images</button>
        </div>
      </div>

      {/* Sales & Purchase Information */}
      <div className="mt-10 border-t pt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Sales Information */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Sales Information</span>
              <label className="flex items-center gap-1 ml-4">
                <input type="checkbox" name="sellable" checked={form.sellable} onChange={handleChange} className="accent-blue-600" /> Sellable
              </label>
            </div>
            <div className="grid grid-cols-6 gap-2 items-center mb-2">
              <label className="col-span-3 text-sm">Selling Price<span className="text-red-500">*</span></label>
              <span className="col-span-1 text-gray-500">INR</span>
              <input name="sellingPrice" value={form.sellingPrice} onChange={handleChange} className="col-span-2 border rounded px-2 py-1" />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Account<span className="text-red-500">*</span></label>
              <select name="salesAccount" value={form.salesAccount} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm">Description</label>
              <textarea name="salesDescription" value={form.salesDescription} onChange={handleChange} className="w-full border rounded px-2 py-1" rows={2}></textarea>
            </div>
          </div>
          {/* Purchase Information */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Purchase Information</span>
              <label className="flex items-center gap-1 ml-4">
                <input type="checkbox" name="purchasable" checked={form.purchasable} onChange={handleChange} className="accent-blue-600" /> Purchasable
              </label>
            </div>
            <div className="grid grid-cols-6 gap-2 items-center mb-2">
              <label className="col-span-3 text-sm">Cost Price<span className="text-red-500">*</span></label>
              <span className="col-span-1 text-gray-500">INR</span>
              <input name="costPrice" value={form.costPrice} onChange={handleChange} className="col-span-2 border rounded px-2 py-1" />
            </div>
            <div className="mb-2">
              <label className="block text-sm">Account<span className="text-red-500">*</span></label>
              <select name="purchaseAccount" value={form.purchaseAccount} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value="Cost of Goods Sold">Cost of Goods Sold</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="mb-2">
              <label className="block text-sm">Description</label>
              <textarea name="purchaseDescription" value={form.purchaseDescription} onChange={handleChange} className="w-full border rounded px-2 py-1" rows={2}></textarea>
            </div>
            <div>
              <label className="block text-sm">Preferred Vendor</label>
              <select name="preferredVendor" value={form.preferredVendor} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value="">--Select--</option>
                <option value="Vendor 1">Vendor 1</option>
                <option value="Vendor 2">Vendor 2</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Default Tax Rates */}
      <div className="mt-8">
        <div className="font-medium mb-2 flex items-center gap-2">
          Default Tax Rates
          <span className="text-gray-400 cursor-pointer text-xs">✎</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Intra State Tax Rate</span>
            <div className="font-semibold">GST18 (18%)</div>
          </div>
          <div>
            <span className="text-gray-600">Inter State Tax Rate</span>
            <div className="font-semibold">IGST18 (18%)</div>
          </div>
        </div>
      </div>

      {/* Track Inventory */}
      <div className="mt-6 flex items-center gap-2">
        <input type="checkbox" name="trackInventory" checked={form.trackInventory} onChange={handleChange} className="accent-blue-600" id="track-inventory" />
        <label htmlFor="track-inventory" className="text-sm">Track Inventory for this item</label>
      </div>

      {/* Save/Cancel Buttons */}
      <div className="mt-8 flex gap-3">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        <button type="button" className="bg-gray-200 px-6 py-2 rounded hover:bg-gray-300" onClick={() => setForm(initialState)}>Cancel</button>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {success && <div className="text-green-600 mt-2">{success}</div>}
    </form>
  );
}
