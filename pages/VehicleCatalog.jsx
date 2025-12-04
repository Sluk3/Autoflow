import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Zap, Fuel, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import GlassModal from '../components/shared/GlassModal';
import CatalogForm from '../components/catalog/CatalogForm';

const ITEMS_PER_PAGE = 50;

export default function VehicleCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [makeFilter, setMakeFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [displacementFilter, setDisplacementFilter] = useState('all');
  const [hpFilter, setHpFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const queryClient = useQueryClient();

  const { data: catalog = [], isLoading } = useQuery({
    queryKey: ['catalog'],
    queryFn: async () => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/76b06855-1902-48cf-839a-2fd7c7aedbd6', {
        headers: {
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        }
      });
      return response.json();
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/fde101e4-34c0-49e4-8ace-fe8a16900854', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        },
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['catalog']);
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/a8b504d5-b490-40f9-ad3e-fa09f50ef838', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        },
        body: JSON.stringify({ id, ...data })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['catalog']);
      setIsModalOpen(false);
      setSelectedItem(null);
    }
  });

  const makes = [...new Set(catalog.map((item) => item.make))].sort();
  const displacements = [...new Set(catalog.map((item) => item.displacement_lt).filter(Boolean))].sort((a, b) => a - b);
  
  // Get models based on selected make
  const availableModels = makeFilter !== 'all' 
    ? [...new Set(catalog.filter(item => item.make === makeFilter).map(item => item.model))].sort()
    : [];

  // Reset model filter when make changes
  React.useEffect(() => {
    setModelFilter('all');
  }, [makeFilter]);

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch = `${item.make} ${item.model} ${item.engine_code || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMake = makeFilter === 'all' || item.make === makeFilter;
    const matchesModel = modelFilter === 'all' || item.model === modelFilter;
    const matchesDisplacement = displacementFilter === 'all' || item.displacement_lt == displacementFilter;
    
    let matchesHp = true;
    if (hpFilter && hpFilter.trim() !== '') {
      const filterValue = parseFloat(hpFilter);
      if (!isNaN(filterValue)) {
        matchesHp = item.original_power_hp == filterValue;
      }
    }

    return matchesSearch && matchesMake && matchesModel && matchesDisplacement && matchesHp;
  });

  const totalPages = Math.ceil(filteredCatalog.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCatalog = filteredCatalog.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSubmit = (data) => {
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, makeFilter, modelFilter, displacementFilter, hpFilter]);

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Vehicle Catalog</h1>
          <p className="text-white/70">{catalog.length} vehicles in database</p>
        </div>
        <Button
          onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Vehicle
        </Button>
      </div>

      <div className="bg-slate-800 p-6 rounded-2xl glass-morphism-card">
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search catalog..."
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <Select value={makeFilter} onValueChange={setMakeFilter}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="All Makes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Makes</SelectItem>
              {makes.map((make) => (
                <SelectItem key={make} value={make}>{make}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={modelFilter} 
            onValueChange={setModelFilter}
            disabled={makeFilter === 'all'}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white disabled:opacity-50">
              <SelectValue placeholder={makeFilter === 'all' ? 'Select Make First' : 'All Models'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={displacementFilter} onValueChange={setDisplacementFilter}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="All Displacements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Displacements</SelectItem>
              {displacements.map((disp) => (
                <SelectItem key={disp} value={disp}>{disp}L</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            value={hpFilter}
            onChange={(e) => setHpFilter(e.target.value)}
            placeholder="HP"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-white/50">Loading...</div>
        ) : (
          <>
            <div className="grid gap-3">
              {paginatedCatalog.map((item) => (
                <div
                  key={item.id}
                  className="glass-morphism-card rounded-xl p-4 glass-hover"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">
                        {item.make} {item.model}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-2">
                        {item.year_from && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.year_from}{item.year_to && item.year_to !== 9999 ? ` - ${item.year_to}` : '+'}
                          </span>
                        )}
                        {item.engine_code && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-400/30">
                            {item.engine_code}
                          </span>
                        )}
                        {item.fuel_type && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-400/30 flex items-center gap-1">
                            <Fuel className="w-3 h-3" />
                            {item.fuel_type}
                          </span>
                        )}
                        {item.displacement_lt && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                            {item.displacement_lt}L
                          </span>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-3 mb-3">
                        <div className="bg-white/5 rounded-lg p-3">
                          <p className="text-white/70 text-xs mb-1">Stock Performance</p>
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-lg font-bold text-white">{item.original_power_hp}</p>
                              <p className="text-white/60 text-xs">HP</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-white">{item.original_torque_nm}</p>
                              <p className="text-white/60 text-xs">Nm</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-lg p-3 border border-emerald-400/30">
                          <p className="text-emerald-300 text-xs mb-1 flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Stage 1 Performance
                          </p>
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-lg font-bold text-white">{item.stage1_power_hp}</p>
                              <p className="text-white/60 text-xs">HP (+{item.stage1_power_hp - item.original_power_hp})</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-white">{item.stage1_torque_nm}</p>
                              <p className="text-white/60 text-xs">Nm (+{item.stage1_torque_nm - item.original_torque_nm})</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white/70 text-xs">Stage 1 Price</p>
                          <p className="text-xl font-bold text-white">
                            €{parseFloat(item.stage1_price_eur || 0).toFixed(2)}
                          </p>
                          {item.stage1_price_with_vat && (
                            <p className="text-white/60 text-xs">
                              €{parseFloat(item.stage1_price_with_vat).toFixed(2)} with VAT
                            </p>
                          )}
                        </div>
                      </div>

                      {item.notes && (
                        <p className="mt-2 text-white/60 text-xs bg-white/5 rounded-lg p-2">
                          {item.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsModalOpen(true);
                        }}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/20">
                <p className="text-white/70 text-sm">
                  Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCatalog.length)} of {filteredCatalog.length}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <GlassModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        title={selectedItem ? 'Edit Catalog Item' : 'New Catalog Item'}
        maxWidth="max-w-4xl"
      >
        <CatalogForm
          catalogItem={selectedItem}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedItem(null);
          }}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </GlassModal>
    </div>
  );
}