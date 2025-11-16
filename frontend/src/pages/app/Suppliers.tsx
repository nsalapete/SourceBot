"use client";

import { useEffect, useState } from "react";
import Papa from "papaparse";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
  import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Loader2,
  Building2,
  Search,
  Grid3x3,
  List,
} from "lucide-react";

export interface Supplier {
  Product: string;
  Packsize: string;
  ["Headoffice ID"]?: number | null;
  ["Branch Name"]?: string | null;
  ["Dept Fullname"]?: string | null;
  ["Group Fullname"]?: string | null;
  ["Trade Price"]?: number | null;
  RRP?: number | null;
  ["Sale ID"]?: number | null;
  ["Qty Sold"]?: number | null;
  Turnover?: number | null;
  ["Vat Amount"]?: number | null;
  ["Sale VAT Rate"]?: number | null;
  ["Turnover ex VAT"]?: number | null;
  ["Disc Amount"]?: number | null;
  Profit?: number | null;
  ["Refund Value"]?: number | null;
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");

  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  const parseNumber = (v: any): number | null => {
    if (v === null || v === undefined) return null;
    const str = String(v).trim();
    if (str === "") return null;
    const cleaned = str.replace(/[^\d.\-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  const fmtCurrency = (n: number | null | undefined): string => {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    return `€${n.toFixed(2)}`;
  };

  const fmtQty = (n: number | null | undefined): string => {
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    return Number.isInteger(n) ? String(n) : String(n);
  };

  Papa.parse<any>("/data/Retail/retail_sales_data_01_09_2023_to_31_10_2025_cleaned.csv", {
  download: true,
  header: true,
  skipEmptyLines: true,

  // ✅ This is the real delimiter — your file is a TRUE CSV, not TSV
  delimiter: ",",

  // ✅ Trim headers AND row values (your rows have leading spaces)
  transformHeader: (h: string) =>
  h
    ?.trim()
    .replace(/^\uFEFF/, "")   // remove BOM
    .replace(/\s+/g, " ")     // collapse weird whitespace
    .replace(/ $/, "")        // remove trailing spaces
    .replace(/^ /, ""),       // remove leading spaces

  transform: (value: string) => (typeof value === "string" ? value.trim() : value),

  complete: (results) => {
    try {
      const rows = results.data as any[];
      console.log("ROWS LOADED:", rows.length);
    console.log("FIRST ROW:", rows[0]);

      const formatted: Supplier[] = rows.map((row) => ({
        Product: row["Product"] ?? "",
        Packsize: row["Packsize"] ?? "",
        ["Headoffice ID"]: parseNumber(row["Headoffice ID"]),
        ["Branch Name"]: row["Branch Name"] ?? null,
        ["Dept Fullname"]: row["Dept Fullname"] ?? null,
        ["Group Fullname"]: row["Group Fullname"] ?? null,
        ["Trade Price"]: parseNumber(row["Trade Price"]),
        RRP: parseNumber(row["RRP"]),
        ["Sale ID"]: parseNumber(row["Sale ID"]),
        ["Qty Sold"]: parseNumber(row["Qty Sold"]),
        Turnover: parseNumber(row["Turnover"]),
        ["Vat Amount"]: parseNumber(row["Vat Amount"]),
        ["Sale VAT Rate"]: parseNumber(row["Sale VAT Rate"]),
        ["Turnover ex VAT"]: parseNumber(row["Turnover ex VAT"]),
        ["Disc Amount"]: parseNumber(row["Disc Amount"]),
        Profit: parseNumber(row["Profit"]),
        ["Refund Value"]: parseNumber(row["Refund Value"]),
      }));

      setSuppliers(formatted);
      setFilteredSuppliers(formatted);
    } catch (err) {
      console.error("Error mapping CSV rows:", err);
      setSuppliers([]);
      setFilteredSuppliers([]);
    } finally {
      setLoading(false);
    }
  },

  error: (err) => {
    console.error("PapaParse error:", err);
    setSuppliers([]);
    setFilteredSuppliers([]);
    setLoading(false);
  },
});

  useEffect(() => {
    let data = [...suppliers];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter((s) => {
        const prod = s.Product?.toLowerCase() ?? "";
        const group = (s["Group Fullname"] ?? "").toLowerCase();
        const branch = (s["Branch Name"] ?? "").toLowerCase();
        return prod.includes(lower) || group.includes(lower) || branch.includes(lower);
      });
    }

    if (categoryFilter !== "all") {
      data = data.filter((s) =>
        (s["Dept Fullname"] ?? "").startsWith(categoryFilter)
      );
    }

    if (branchFilter !== "all") {
      data = data.filter((s) => s["Branch Name"] === branchFilter);
    }

    setFilteredSuppliers(data);
  }, [searchTerm, categoryFilter, branchFilter, suppliers]);

  const categories = Array.from(
    new Set(
      suppliers
        .map((s) => s["Dept Fullname"]?.split(":")?.[0]?.trim())
        .filter(Boolean)
    )
  );

  const branches = Array.from(
    new Set(suppliers.map((s) => s["Branch Name"]).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* UI CODE UNCHANGED */}
      {/* ------------------------------------------------------ */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Supplier Database</CardTitle>
              <CardDescription>
                Loaded from CSV (demo). Missing numeric values are shown as "—".
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardContent>
          <div className="space-y-4 mb-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search suppliers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={branchFilter} onValueChange={setBranchFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={viewMode === "cards" ? "default" : "outline"}
                  onClick={() => setViewMode("cards")}
                  className="whitespace-nowrap"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "table" ? "default" : "outline"}
                  onClick={() => setViewMode("table")}
                  className="whitespace-nowrap"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : viewMode === "cards" ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((s, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{s.Product}</CardTitle>
                        <CardDescription className="text-xs mt-1">
                          {s["Branch Name"] ?? "—"}
                        </CardDescription>
                      </div>
                      <Badge className="whitespace-nowrap">
                        {fmtCurrency(s.RRP ?? null)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {s["Dept Fullname"]?.split(":")?.[0] ?? "—"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">
                          Trade Price
                        </p>
                        <p className="font-semibold">
                          {fmtCurrency(s["Trade Price"] ?? null)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">
                          Qty Sold
                        </p>
                        <p className="font-semibold">
                          {fmtQty(s["Qty Sold"] ?? null)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-muted-foreground text-xs font-medium mb-1">
                        Sale ID
                      </p>
                      <p className="text-sm text-primary truncate">
                        {s["Sale ID"] ?? "—"}
                      </p>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead>Product</TableHead>
                    <TableHead>Packsize</TableHead>
                    <TableHead>Dept</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Trade Price</TableHead>
                    <TableHead>RRP</TableHead>
                    <TableHead>Qty</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredSuppliers.map((s, idx) => (
                    <TableRow key={idx} className="border-b hover:bg-muted/30">
                      <TableCell>{s.Product}</TableCell>
                      <TableCell>{s.Packsize}</TableCell>
                      <TableCell>{s["Dept Fullname"] ?? "—"}</TableCell>
                      <TableCell>{s["Group Fullname"] ?? "—"}</TableCell>
                      <TableCell>{s["Branch Name"] ?? "—"}</TableCell>
                      <TableCell>{fmtCurrency(s["Trade Price"] ?? null)}</TableCell>
                      <TableCell>{fmtCurrency(s.RRP ?? null)}</TableCell>
                      <TableCell>{fmtQty(s["Qty Sold"] ?? null)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No suppliers match your filters</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setBranchFilter("all");
                }}
                className="mt-2"
              >
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Note:</strong> This data is loaded from a CSV file. Missing or unparseable numeric values are shown as "—".
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
