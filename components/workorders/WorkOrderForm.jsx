
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';

export default function WorkOrderForm({ workOrder, onSubmit, onCancel, isLoading }) {
  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm({
    defaultValues: workOrder || {
      customer_id: '',
      customer_vehicle_id: '',
      status: 'SCHEDULED',
      work_type: '',
      work_description: '',
      scheduled_date: '',
      completed_date: '',
      labor_hours: '',
      labor_rate_eur: '20.00',
      parts_cost_eur: '0.00',
      total_price_eur: '',
      payment_status: 'pending',
      payment_method: '',
      invoice_number: '',
      notes: '',
    }
  });

  // Prepopulate dates when editing
  React.useEffect(() => {
    if (workOrder) {
      if (workOrder.scheduled_date) {
        const scheduledDate = new Date(workOrder.scheduled_date);
        const formattedScheduled = scheduledDate.toISOString().slice(0, 16);
        setValue('scheduled_date', formattedScheduled);
      }
      if (workOrder.completed_date) {
        const completedDate = new Date(workOrder.completed_date);
        const formattedCompleted = completedDate.toISOString().slice(0, 16);
        setValue('completed_date', formattedCompleted);
      }
    }
  }, [workOrder, setValue]);

  const [customerOpen, setCustomerOpen] = React.useState(false);
  const [vehicleOpen, setVehicleOpen] = React.useState(false);

  const { data: customers = [] } = useQuery({
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

  const { data: vehicles = [] } = useQuery({
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

  const selectedCustomer = watch('customer_id');
  const customerVehicles = selectedCustomer 
    ? vehicles.filter(v => v.customer_id === selectedCustomer)
    : vehicles;

  const getCustomerLabel = (customer) => 
    `${customer.first_name} ${customer.last_name}`;

  const getVehicleLabel = (v) => 
    `${v.make} ${v.model} ${v.year ? `(${v.year})` : ''} ${v.original_power_hp ? `${v.original_power_hp}HP` : ''} ${v.engine_code || ''} - ${v.license_plate || 'No Plate'}`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {!workOrder && (
          <div className="md:col-span-2">
            <Label className="text-white mb-2">Customer *</Label>
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
                              setValue('customer_vehicle_id', '');
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
        )}

        <div className="md:col-span-2">
          <Label className="text-white mb-2">Vehicle *</Label>
          <Controller
            name="customer_vehicle_id"
            control={control}
            rules={{ required: 'Vehicle is required' }}
            render={({ field }) => (
              workOrder ? (
                <div className="p-3 rounded-lg bg-white/10 border border-white/20 text-white">
                  {getVehicleLabel(vehicles.find((v) => v.vehicle_id === field.value) || workOrder)}
                </div>
              ) : (
                <Popover open={vehicleOpen} onOpenChange={setVehicleOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      {field.value
                        ? getVehicleLabel(customerVehicles.find((v) => v.vehicle_id === field.value) || {})
                        : "Select vehicle..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search vehicle..." className="h-9" />
                      <CommandEmpty>No vehicle found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {customerVehicles.map((v) => (
                          <CommandItem
                            key={v.vehicle_id}
                            value={`${v.make} ${v.model} ${v.license_plate}`}
                            onSelect={() => {
                              field.onChange(v.vehicle_id);
                              setVehicleOpen(false);
                            }}
                          >
                            {getVehicleLabel(v)}
                            <Check
                              className={`ml-auto h-4 w-4 ${
                                v.vehicle_id === field.value ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              )
            )}
          />
          {errors.customer_vehicle_id && (
            <p className="text-red-400 text-sm mt-1">{errors.customer_vehicle_id.message}</p>
          )}
        </div>

        <div>
          <Label className="text-white mb-2">Work Type *</Label>
          <Input
            {...register('work_type', { required: 'Work type is required' })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Oil Change, Repair, etc."
          />
          {errors.work_type && (
            <p className="text-red-400 text-sm mt-1">{errors.work_type.message}</p>
          )}
        </div>

        <div>
          <Label className="text-white mb-2">Status</Label>
          <Select
            value={watch('status')}
            onValueChange={(value) => setValue('status', value)}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SCHEDULED">Scheduled</SelectItem>
              <SelectItem value="IN_REPAIR">In Repair</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-2">Scheduled Date *</Label>
          <Input
            {...register('scheduled_date', { required: 'Scheduled date is required' })}
            type="datetime-local"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        {watch('status') === 'COMPLETED' && (
          <div>
            <Label className="text-white mb-2">Completed Date</Label>
            <Input
              {...register('completed_date')}
              type="datetime-local"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        )}

        <div>
          <Label className="text-white mb-2">Labor Hours</Label>
          <Input
            {...register('labor_hours')}
            type="number"
            step="0.1"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="5"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Labor Rate (€/h)</Label>
          <Input
            {...register('labor_rate_eur')}
            type="number"
            step="0.01"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="20.00"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Parts Cost (€)</Label>
          <Input
            {...register('parts_cost_eur')}
            type="number"
            step="0.01"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="0.00"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Total Price (€)</Label>
          <Input
            {...register('total_price_eur')}
            type="number"
            step="0.01"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="150.00"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Payment Status</Label>
          <Select
            value={watch('payment_status')}
            onValueChange={(value) => setValue('payment_status', value)}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-2">Payment Method</Label>
          <Input
            {...register('payment_method')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Cash, Card, Transfer"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Invoice Number</Label>
          <Input
            {...register('invoice_number')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="INV-2025-001"
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-white mb-2">Work Description</Label>
          <Textarea
            {...register('work_description')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-24"
            placeholder="Detailed description of work to be performed..."
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-white mb-2">Notes</Label>
          <Textarea
            {...register('notes')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-20"
            placeholder="Additional notes..."
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
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
        >
          {isLoading ? 'Saving...' : workOrder ? 'Update Work Order' : 'Create Work Order'}
        </Button>
      </div>
    </form>
  );
}
