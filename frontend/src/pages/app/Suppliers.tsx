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
import { Loader2, Building2, Search } from "lucide-react";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<api.Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<api.Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");

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
          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((s) => s.category === categoryFilter);
    }

    if (countryFilter !== "all") {
      filtered = filtered.filter((s) => s.country === countryFilter);
    }

    setFilteredSuppliers(filtered);
  };

  const categories = Array.from(new Set(suppliers.map((s) => s.category)));
  const countries = Array.from(new Set(suppliers.map((s) => s.country)));

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
          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-4 mb-6">
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
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>MOQ</TableHead>
                  <TableHead>Lead Time</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{supplier.category}</Badge>
                    </TableCell>
                    <TableCell>{supplier.country}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{supplier.rating} ⭐</Badge>
                    </TableCell>
                    <TableCell>{supplier.moq}</TableCell>
                    <TableCell>{supplier.leadTime}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {supplier.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
