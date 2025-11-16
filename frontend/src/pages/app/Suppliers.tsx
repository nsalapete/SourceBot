import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import * as api from "@/lib/api";
import { Loader2, Building2, Search, Grid3x3, List } from "lucide-react";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<api.Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<api.Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  useEffect(() => {
    loadSuppliers();
  }, []);

  useEffect(() => {
    filterSuppliers();
  }, [searchTerm, categoryFilter, countryFilter, suppliers]);

  const loadSuppliers = async () => {
    try {
      const data = await api.getAllSuppliers();
      setSuppliers(data);
      setFilteredSuppliers(data);
    } catch (error) {
      console.error("Failed to load suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSuppliers = () => {
    let filtered = [...suppliers];

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.Product.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.OrderList.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.Branch_Name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((s) => s.Dept_Fullname?.startsWith(categoryFilter));
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter((s) => s.Branch_Name === countryFilter);
    }

    setFilteredSuppliers(filtered);
  };

  const categories = Array.from(new Set(suppliers.map((s) => s.Dept_Fullname?.split(':')?.[0])));
  const countries = Array.from(new Set(suppliers.map((s) => s.Branch_Name)));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Supplier Database</CardTitle>
              <CardDescription>
                Simulated CRM data - in production, this syncs with your actual supplier database
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters and View Toggle */}
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
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Branches" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* View Toggle */}
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
            // Card View
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{supplier.Product}</CardTitle>
                        <CardDescription className="text-xs mt-1">{supplier.Branch_Name}</CardDescription>
                      </div>
                      <Badge className="whitespace-nowrap">€{supplier.RRP?.toFixed(2)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">{supplier.Dept_Fullname?.split(':')?.[0]}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Trade Price</p>
                        <p className="font-semibold">€{supplier.Trade_Price?.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs font-medium">Stock Level</p>
                        <p className="font-semibold">{supplier.Branch_Stock_Level}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium mb-1">Order List</p>
                      <p className="text-sm text-primary truncate">{supplier.OrderList}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Table View (matching screenshot style)
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead className="text-muted-foreground font-semibold">Product</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Packsize</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">OrderList</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Trade Price</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">RRP</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Dept</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Group</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Branch</TableHead>
                    <TableHead className="text-muted-foreground font-semibold">Stock Level</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="border-b hover:bg-muted/30 transition-colors">
                      <TableCell className="font-semibold text-foreground">{supplier.Product}</TableCell>
                      <TableCell className="text-foreground">{supplier.Packsize}</TableCell>
                      <TableCell className="text-foreground">{supplier.OrderList}</TableCell>
                      <TableCell className="text-foreground">€{supplier.Trade_Price?.toFixed(2)}</TableCell>
                      <TableCell className="text-foreground">€{supplier.RRP?.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-muted text-xs">{supplier.Dept_Fullname?.split(':')[0]}</Badge>
                      </TableCell>
                      <TableCell className="text-foreground text-sm">{supplier.Group_Fullname}</TableCell>
                      <TableCell className="text-foreground">{supplier.Branch_Name}</TableCell>
                      <TableCell className="text-foreground font-medium">{supplier.Branch_Stock_Level}</TableCell>
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
                  setCountryFilter("all");
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
            💡 <strong>Note:</strong> This data is mocked. In production, this will read from your 
            Flask backend connected to your actual CRM or supplier database (JSON file or SQL).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
