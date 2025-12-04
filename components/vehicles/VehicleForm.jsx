
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import GlassModal from '../shared/GlassModal';
import CatalogForm from '../catalog/CatalogForm';
import CustomerForm from '../customers/CustomerForm';

export default function VehicleForm({ vehicle, onSubmit, onCancel, isLoading }) {
  const [showCatalogModal, setShowCatalogModal] = React.useState(false);
  const [showCustomerModal, setShowCustomerModal] = React.useState(false);
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    defaultValues: vehicle || {
      customer_id: '',
      vehicle_catalog_id: '',
      license_plate: '',
      vin: '',
      year: '',
      updated_hp: '', // Added updated_hp field
      itv_inspection: '',
      is_active: true,
      notes: '',
    }
  });

  // Prepopulate dates when editing
  React.useEffect(() => {
    if (vehicle?.itv_inspection) {
      const date = new Date(vehicle.itv_inspection);
      const formattedDate = date.toISOString().split('T')[0];
      setValue('itv_inspection', formattedDate);
    }
  }, [vehicle, setValue]);

  const [customerOpen, setCustomerOpen] = React.useState(false);
  const [vehicleOpen, setVehicleOpen] = React.useState(false);

  const { data: customers = [], refetch: refetchCustomers } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/5917132c-5c5a-4d35-b493-6062989ee46a', {
        headers: {
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        }
      });
      return response.json();
    },
  });

  const { data: vehicleCatalog = [], refetch: refetchCatalog } = useQuery({
    queryKey: ['catalog'],
    queryFn: async () => {
      const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/76b06855-1902-48cf-839a-2fd7c7aedbd6', {
        headers: {
          'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
        }
      });
      return response.json();
    },
  });

  const getCustomerLabel = (customer) => 
    `${customer.first_name} ${customer.last_name}`;

  const getVehicleLabel = (v) => 
    `${v.make} ${v.model} (${v.year_from}${v.year_to && v.year_to !== 9999 ? `-${v.year_to}` : '+'}) ${v.original_power_hp}HP ${v.engine_code}`;

  const handleCatalogSubmit = async (data) => {
    const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/fde101e4-34c0-49e4-8ace-fe8a16900854', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
      },
      body: JSON.stringify(data),
    });
    await response.json();
    await refetchCatalog();
    setShowCatalogModal(false);
  };

  const handleCustomerSubmit = async (data) => {
    const response = await fetch('https://n8n.srv1041062.hstgr.cloud/webhook/f7a0c555-e94b-419a-a699-a05120727949', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-api-key': 'A-secret-is-something-you-should-keep-to-yourself-BCPerformance'
      },
      body: JSON.stringify(data),
    });
    await response.json();
    await refetchCustomers();
    setShowCustomerModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-white">Customer *</Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowCustomerModal(true)}
                className="text-blue-400 hover:text-blue-300 hover:bg-slate-700 h-auto py-1"
              >
                <Plus className="w-4 h-4 mr-1" />
                Register New Customer
              </Button>
            </div>
            <Controller
              name="customer_id"
              control={control}
              rules={{ required: 'Customer is required' }}
              render={({ field }) => (
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {field.value
                        ? getCustomerLabel(customers.find((c) => c.customer_id === field.value) || {})
                        : "Select customer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search customer..." className="h-9" />
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.customer_id}
                            value={`${customer.first_name} ${customer.last_name}`}
                            onSelect={() => {
                              field.onChange(customer.customer_id);
                              setCustomerOpen(false);
                            }}
                          >
                            {getCustomerLabel(customer)}
                            <Check
                              className={`ml-auto h-4 w-4 ${
                                customer.customer_id === field.value ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
            {errors.customer_id && (
              <p className="text-red-400 text-sm mt-1">{errors.customer_id.message}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-white">Vehicle Model</Label>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowCatalogModal(true)}
                className="text-blue-400 hover:text-blue-300 hover:bg-slate-700 h-auto py-1"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Vehicle in Catalog
              </Button>
            </div>
            <Controller
              name="vehicle_catalog_id"
              control={control}
              render={({ field }) => (
                <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {field.value
                        ? getVehicleLabel(vehicleCatalog.find((v) => v.id === field.value) || {})
                        : "Select vehicle..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vehicle..." className="h-9" />
                      <CommandEmpty>No vehicle found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {vehicleCatalog.map((v) => (
                          <CommandItem
                            key={v.id}
                            value={`${v.make} ${v.model} ${v.engine_code}`}
                            onSelect={() => {
                              field.onChange(v.id);
                              setVehicleOpen(false);
                            }}
                          >
                            {getVehicleLabel(v)}
                            <Check
                              className={`ml-auto h-4 w-4 ${
                                v.id === field.value ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )}
            />
          </div>

          <div>
            <Label className="text-white mb-2">License Plate *</Label>
            <Input
              {...register('license_plate', { required: 'License plate is required' })}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="AB123CD"
            />
            {errors.license_plate && (
              <p className="text-red-400 text-sm mt-1">{errors.license_plate.message}</p>
            )}
          </div>

          <div>
            <Label className="text-white mb-2">VIN</Label>
            <Input
              {...register('vin')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="1234567890ABCDE"
            />
          </div>

          <div>
            <Label className="text-white mb-2">Year</Label>
            <Input
              {...register('year')}
              type="number"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="2020"
            />
          </div>

          {/* New field for Updated HP */}
          <div>
            <Label className="text-white mb-2">Updated HP</Label>
            <Input
              {...register('updated_hp')}
              type="number"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="190"
            />
          </div>

          <div>
            <Label className="text-white mb-2">ITV Inspection Date</Label>
            <Input
              {...register('itv_inspection')}
              type="date"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="flex items-center gap-2 mt-8">
            <input
              type="checkbox"
              {...register('is_active')}
              className="w-5 h-5 rounded border-white/20"
            />
            <Label className="text-white">Active Vehicle</Label>
          </div>

          <div className="md:col-span-2">
            <Label className="text-white mb-2">Notes</Label>
            <Textarea
              {...register('notes')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-24"
              placeholder="Vehicle-specific notes..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
          >
            {isLoading ? 'Saving...' : vehicle ? 'Update Vehicle' : 'Add Vehicle'}
          </Button>
        </div>
      </form>

      <GlassModal
        isOpen={showCatalogModal}
        onClose={() => setShowCatalogModal(false)}
        title="Add Vehicle to Catalog"
        maxWidth="max-w-4xl"
      >
        <CatalogForm
          catalogItem={null}
          onSubmit={handleCatalogSubmit}
          onCancel={() => setShowCatalogModal(false)}
          isLoading={false}
        />
      </GlassModal>

      <GlassModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        title="Register New Customer"
      >
        <CustomerForm
          customer={null}
          onSubmit={handleCustomerSubmit}
          onCancel={() => setShowCustomerModal(false)}
          isLoading={false}
        />
      </GlassModal>
    </>
  );
}
