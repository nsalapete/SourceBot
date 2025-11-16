import React, { useMemo, useState } from "react";
import "./SupplierDatabase.css";

type Supplier = {
  id: string;
  name: string;
  category: string;
  country: string;
  rating: number;
  moq: string;
  leadTime: string;
  email: string;
};

const SAMPLE_SUPPLIERS: Supplier[] = [
  { id: "s1", name: "TechParts Global", category: "Electronics", country: "China", rating: 4.8, moq: "5,000 units", leadTime: "45 days", email: "contact@techparts.com" },
  { id: "s2", name: "Euro Manufacturing Co", category: "Electronics", country: "Germany", rating: 4.6, moq: "10,000 units", leadTime: "60 days", email: "sales@euromanuf.de" },
  { id: "s3", name: "Asia Components Ltd", category: "Electronics", country: "Taiwan", rating: 4.7, moq: "3,000 units", leadTime: "30 days", email: "info@asiacomp.tw" },
  { id: "s4", name: "Global Tech Suppliers", category: "Electronics", country: "South Korea", rating: 4.9, moq: "8,000 units", leadTime: "50 days", email: "contact@globaltech.kr" },
  { id: "s5", name: "PrimeParts Inc", category: "Electronics", country: "USA", rating: 4.5, moq: "15,000 units", leadTime: "40 days", email: "sales@primeparts.com" },
];

export default function SupplierDatabase({ suppliers = SAMPLE_SUPPLIERS }: { suppliers?: Supplier[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [country, setCountry] = useState("All Countries");

  const categories = useMemo(() => ["All Categories", ...Array.from(new Set(suppliers.map(s => s.category)))], [suppliers]);
  const countries = useMemo(() => ["All Countries", ...Array.from(new Set(suppliers.map(s => s.country)))], [suppliers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suppliers.filter(s => {
      if (category !== "All Categories" && s.category !== category) return false;
      if (country !== "All Countries" && s.country !== country) return false;
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
    });
  }, [suppliers, query, category, country]);

  return (
    <div className="sb-card">
      <div className="sb-card-header">
        <div>
          <h3>Supplier Database</h3>
          <p className="sb-sub">Simulated CRM data - in production, this syncs with your actual supplier database</p>
        </div>
        <div className="sb-filters">
          <input className="sb-search" placeholder="Search suppliers..." value={query} onChange={e => setQuery(e.target.value)} />
          <select className="sb-select" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="sb-select" value={country} onChange={e => setCountry(e.target.value)}>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <table className="sb-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Country</th>
            <th>Rating</th>
            <th>MOQ</th>
            <th>Lead Time</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id}>
              <td className="sb-name">{s.name}</td>
              <td><span className="sb-pill">{s.category}</span></td>
              <td>{s.country}</td>
              <td><span className="sb-rating">{s.rating.toFixed(1)} <span className="sb-star">★</span></span></td>
              <td>{s.moq}</td>
              <td>{s.leadTime}</td>
              <td className="sb-email">{s.email}</td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={7} className="sb-empty">No suppliers match your search.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}