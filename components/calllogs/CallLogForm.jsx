import React from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CallLogForm({ callLog, onSubmit, onCancel, isLoading }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: callLog || {
      customer_id: '',
      call_type: 'INCOMING',
      call_date: new Date().toISOString().slice(0, 16),
      duration_minutes: '',
      subject: '',
      notes: '',
    }
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => base44.entities.Customer.list(),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Label className="text-white mb-2">Customer *</Label>
          <Select
            value={watch('customer_id')}
            onValueChange={(value) => setValue('customer_id', value)}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select customer" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.first_name} {customer.last_name} - {customer.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-2">Call Type</Label>
          <Select
            value={watch('call_type')}
            onValueChange={(value) => setValue('call_type', value)}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOMING">Incoming</SelectItem>
              <SelectItem value="OUTGOING">Outgoing</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-2">Call Date & Time *</Label>
          <Input
            {...register('call_date', { required: 'Call date is required' })}
            type="datetime-local"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Duration (minutes)</Label>
          <Input
            {...register('duration_minutes')}
            type="number"
            step="0.1"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="5"
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-white mb-2">Subject *</Label>
          <Input
            {...register('subject', { required: 'Subject is required' })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Appointment inquiry, follow-up, etc."
          />
          {errors.subject && (
            <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <Label className="text-white mb-2">Notes</Label>
          <Textarea
            {...register('notes')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-32"
            placeholder="Call details, action items, etc."
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
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
        >
          {isLoading ? 'Saving...' : callLog ? 'Update Call Log' : 'Create Call Log'}
        </Button>
      </div>
    </form>
  );
}