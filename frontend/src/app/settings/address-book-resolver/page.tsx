"use client";
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Search, Plus, Settings, Trash2 } from "lucide-react";
import NavbarComponents from "@/components/layouts/NavbarComponents";

const AddressResolvePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [endpoints, setEndpoints] = useState([
    {
      id: 1,
      name: 'OpenSea Resolver',
      endpoint: 'https://api.opensea.io/resolve',
      status: 'Active',
      apiHeader: 'X-API-KEY',
      apiKey: '**********************',
      lastChecked: '2024-01-27 09:30:00'
    }
  ]);
  
  const [newEndpoint, setNewEndpoint] = useState({
    name: '',
    endpoint: '',
    apiHeader: '',
    apiKey: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEndpoint(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEndpoint = () => {
    if (newEndpoint.name && newEndpoint.endpoint) {
      const newId = endpoints.length > 0 ? Math.max(...endpoints.map(e => e.id)) + 1 : 1;
      setEndpoints(prev => [...prev, {
        ...newEndpoint,
        id: newId,
        status: 'Active',
        lastChecked: new Date().toISOString()
      }]);
      setNewEndpoint({ name: '', endpoint: '', apiHeader: '', apiKey: '' });
      setIsDialogOpen(false);
    }
  };

  const handleDeleteEndpoint = (id) => {
    setEndpoints(prev => prev.filter(endpoint => endpoint.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Address Resolver</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl font-bold">Address Resolver</CardTitle>
                <CardDescription>Manage third-party endpoints for address resolution</CardDescription>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Endpoint
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Resolver Endpoint</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newEndpoint.name}
                        onChange={handleInputChange}
                        placeholder="e.g., OpenSea Resolver"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endpoint">Endpoint URL</Label>
                      <Input
                        id="endpoint"
                        name="endpoint"
                        value={newEndpoint.endpoint}
                        onChange={handleInputChange}
                        placeholder="https://api.example.com/resolve"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="apiHeader">API Header</Label>
                      <Input
                        id="apiHeader"
                        name="apiHeader"
                        value={newEndpoint.apiHeader}
                        onChange={handleInputChange}
                        placeholder="X-API-KEY"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="apiKey">API Key</Label>
                      <Input
                        id="apiKey"
                        name="apiKey"
                        type="password"
                        value={newEndpoint.apiKey}
                        onChange={handleInputChange}
                        placeholder="Enter API Key"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddEndpoint}>
                      Add Endpoint
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search endpoints..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Endpoint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Checked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {endpoints
                  .filter(endpoint => 
                    endpoint.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    endpoint.endpoint.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((endpoint) => (
                    <TableRow key={endpoint.id}>
                      <TableCell className="font-medium">{endpoint.name}</TableCell>
                      <TableCell>{endpoint.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant={endpoint.status === 'Active' ? 'success' : 'destructive'}>
                          {endpoint.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{endpoint.lastChecked}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteEndpoint(endpoint.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AddressResolvePage;