import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
      setSuccess("Item saved successfully!");
      if (onSave) onSave();
      setForm(initialState);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.message || "Failed to save item.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="bg-bg-card rounded-2xl shadow-lg border border-theme-light p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-primary">New Item</h2>
          <div className="flex gap-3">
            <button type="submit" className="btn-theme-primary px-8 py-3 rounded-xl transition-all font-semibold" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" className="bg-bg-card border-2 border-theme-medium text-secondary px-8 py-3 rounded-xl hover:bg-hover hover:border-accent-blue transition-all font-semibold" onClick={() => navigate("/")}>
              Cancel
            </button>
          </div>
        </div>
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-5 py-4 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-5 py-4 rounded-lg">
            {success}
          </div>
        )}

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-6 mb-2">
              <label className="font-medium text-primary">Type</label>
              <label className="flex items-center gap-2">
                <input type="radio" name="type" value="Goods" checked={form.type === "Goods"} onChange={handleChange} className="accent-theme-medium w-4 h-4" /> 
                <span className="text-sm text-primary">Goods</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="type" value="Service" checked={form.type === "Service"} onChange={handleChange} className="accent-theme-medium w-4 h-4" /> 
                <span className="text-sm text-primary">Service</span>
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Name<span className="text-error">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">SKU</label>
                <input name="sku" value={form.sku} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Unit</label>
                <select name="unit" value={form.unit} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent">
                  <option value="">--Select--</option>
                  <option value="Nos">Nos</option>
                  <option value="Kg">Kg</option>
                  <option value="Litre">Litre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary mb-1">HSN Code</label>
                <input name="hsn" value={form.hsn} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Tax Preference <span className="text-error">*</span></label>
                <select name="taxPreference" value={form.taxPreference} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent">
                  <option value="Taxable">Taxable</option>
                  <option value="Non-Taxable">Non-Taxable</option>
                </select>
              </div>
            </div>
          </div>
          {/* Image upload */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-theme-medium rounded-lg h-48 bg-hover hover:bg-accent-blue hover:bg-opacity-10 hover:border-accent-blue transition-all cursor-pointer">
            <svg className="w-12 h-12 text-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-primary text-sm mb-2">Drag image(s) here or</span>
            <button type="button" className="text-theme-medium hover:text-accent-blue font-medium text-sm">Browse images</button>
          </div>
        </div>

        {/* Sales & Purchase Information */}
        <div className="mt-10 border-t border-theme-light pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Sales Information */}
            <div className="bg-accent-blue bg-opacity-10 p-5 rounded-lg border border-accent-blue border-opacity-30">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-semibold text-primary">Sales Information</span>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="sellable" checked={form.sellable} onChange={handleChange} className="accent-theme-medium w-4 h-4" /> 
                  <span className="text-sm text-primary">Sellable</span>
                </label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Selling Price<span className="text-error">*</span></label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-sm font-medium">INR</span>
                    <input name="sellingPrice" value={form.sellingPrice} onChange={handleChange} className="flex-1 border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Account<span className="text-error">*</span></label>
                  <select name="salesAccount" value={form.salesAccount} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent">
                    <option value="Sales">Sales</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Description</label>
                  <textarea name="salesDescription" value={form.salesDescription} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent" rows={2}></textarea>
                </div>
              </div>
            </div>
            {/* Purchase Information */}
            <div className="bg-accent-light bg-opacity-10 p-5 rounded-lg border border-accent-light border-opacity-30">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-semibold text-primary">Purchase Information</span>
                <label className="flex items-center gap-2">
                  <input type="checkbox" name="purchasable" checked={form.purchasable} onChange={handleChange} className="accent-theme-medium w-4 h-4" /> 
                  <span className="text-sm text-primary">Purchasable</span>
                </label>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Cost Price<span className="text-error">*</span></label>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-sm font-medium">INR</span>
                    <input name="costPrice" value={form.costPrice} onChange={handleChange} className="flex-1 border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Account<span className="text-error">*</span></label>
                  <select name="purchaseAccount" value={form.purchaseAccount} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent">
                    <option value="Cost of Goods Sold">Cost of Goods Sold</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Description</label>
                  <textarea name="purchaseDescription" value={form.purchaseDescription} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent" rows={2}></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">Preferred Vendor</label>
                  <select name="preferredVendor" value={form.preferredVendor} onChange={handleChange} className="w-full border border-theme-medium rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent">
                    <option value="">--Select--</option>
                    <option value="Vendor 1">Vendor 1</option>
                    <option value="Vendor 2">Vendor 2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Default Tax Rates */}
        <div className="mt-8 bg-theme-lightest p-4 rounded-lg">
          <div className="font-medium mb-3 flex items-center gap-2 text-primary">
            Default Tax Rates
            <button type="button" className="text-muted hover:text-primary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <span className="text-primary">Intra State Tax Rate</span>
              <div className="font-semibold text-primary mt-1">GST18 (18%)</div>
            </div>
            <div>
              <span className="text-primary">Inter State Tax Rate</span>
              <div className="font-semibold text-primary mt-1">IGST18 (18%)</div>
            </div>
          </div>
        </div>

        {/* Track Inventory */}
        <div className="mt-6 flex items-center gap-2">
          <input type="checkbox" name="trackInventory" checked={form.trackInventory} onChange={handleChange} className="accent-theme-medium w-4 h-4" id="track-inventory" />
          <label htmlFor="track-inventory" className="text-sm text-primary">Track Inventory for this item</label>
        </div>
      </form>
    </div>
  );
}

