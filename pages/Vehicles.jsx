import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Calendar, CheckCircle, XCircle, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlassModal from '../components/shared/GlassModal';
import VehicleForm from '../components/vehicles/VehicleForm';
import { format } from 'date-fns';

const ITEMS_PER_PAGE = 50;

export default function Vehicles() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const queryClient = useQueryClient();

  const { data: vehicles = [], isLoading } = useQuery({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/5917132c-5c5a-4d35-b493-6012989ee46a', {
        headers: {
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        }
      });
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/ca4bf509-dee1-4241-b9ff-0aeb71e4ad93', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      setIsModalOpen(false);
      setSelectedVehicle(null);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/d506400d-4934-4bd6-a734-38ad303dd1f4', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        },
        body: JSON.stringify({
          vehicle_id: id,
          customer_id: data.customer_id,
          vehicle_catalog_id: data.vehicle_catalog_id,
          ...data
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['vehicles']);
      setIsModalOpen(false);
      setSelectedVehicle(null);
    },
  });

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = `${vehicle.license_plate || ''} ${vehicle.customer_name || ''} ${vehicle.make || ''} ${vehicle.model || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    
    const matchesActive = activeFilter === 'all' || 
      (activeFilter === 'active' && vehicle.is_active) ||
      (activeFilter === 'inactive' && !vehicle.is_active);
    
    return matchesSearch && matchesActive;
  });

  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (data) => {
    if (selectedVehicle) {
      updateMutation.mutate({ id: selectedVehicle.vehicle_id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter]);

  const PaginationControls = () => (
    <div className="flex items-center justify-between">
      <p className="text-slate-300 text-sm">
        Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredVehicles.length)} of {filteredVehicles.length}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <span className="text-white text-sm flex items-center px-3">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Vehicles</h1>
          <p className="text-slate-400">{vehicles.length} total vehicles</p>
        </div>
        <Button
          onClick={() => {
            setSelectedVehicle(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="glass-morphism-card rounded-2xl p-6">
        <div className="space-y-4 mb-6">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
            <TabsList className="bg-slate-800 border border-slate-700 grid grid-cols-3 w-full md:w-auto">
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300">
                Active
              </TabsTrigger>
              <TabsTrigger value="inactive" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300">
                Inactive
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-300">
                All
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vehicles..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>
        </div>

        {totalPages > 1 && <div className="mb-4"><PaginationControls /></div>}

        {isLoading ? (
          <div className="text-center py-12 text-slate-400">Loading...</div>
        ) : (
          <div className="grid gap-4">
            {paginatedVehicles.map((vehicle) => {
              let hpDisplay = null;
              if (vehicle.updated_hp && vehicle.original_power_hp) {
                hpDisplay = `${vehicle.original_power_hp} HP → ${vehicle.updated_hp} HP`;
              } else if (vehicle.updated_hp) {
                hpDisplay = `${vehicle.updated_hp} HP`;
              } else if (vehicle.original_power_hp) {
                hpDisplay = `${vehicle.original_power_hp} HP`;
              }

              return (
                <div
                  key={vehicle.vehicle_id}
                  className="glass-morphism-card rounded-xl p-6 glass-hover"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-white">
                          {vehicle.license_plate || 'No Plate'}
                        </h3>
                        {vehicle.is_active ? (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-300 border border-red-400/30">
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 text-lg mb-2">
                        {vehicle.make} {vehicle.model} {vehicle.year && `(${vehicle.year})`}
                      </p>
                      <p className="text-slate-400 mb-3">Owner: {vehicle.customer_name || 'Unknown'}</p>

                      {vehicle.engine_code && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                            {vehicle.engine_code}
                          </span>
                          {vehicle.fuel_type && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-400/30">
                              {vehicle.fuel_type}
                            </span>
                          )}
                          {hpDisplay && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {hpDisplay}
                            </span>
                          )}
                        </div>
                      )}

                      {vehicle.ITV_inspection && (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span>ITV: {format(new Date(vehicle.ITV_inspection), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      {vehicle.vin && (
                        <p className="text-slate-400 text-sm mt-2">VIN: {vehicle.vin}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedVehicle(vehicle);
                          setIsModalOpen(true);
                        }}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {totalPages > 1 && <div className="mt-4 pt-4 border-t border-slate-700"><PaginationControls /></div>}
      </div>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
        title={selectedVehicle ? 'Edit Vehicle' : 'New Vehicle'}
      >
        <VehicleForm
          vehicle={selectedVehicle}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedVehicle(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </GlassModal>
    </div>
  );
}