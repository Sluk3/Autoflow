
import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function CustomerForm({ customer, onSubmit, onCancel, isLoading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: customer || {
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postal_code: '',
      notes: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white mb-2">First Name *</Label>
          <Input
            {...register('first_name', { required: 'First name is required' })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Mario"
          />
          {errors.first_name && (
            <p className="text-red-400 text-sm mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <Label className="text-white mb-2">Last Name *</Label>
          <Input
            {...register('last_name', { required: 'Last name is required' })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Rossi"
          />
          {errors.last_name && (
            <p className="text-red-400 text-sm mt-1">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <Label className="text-white mb-2">Phone *</Label>
          <Input
            {...register('phone', { required: 'Phone is required' })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="3201234567"
          />
          {errors.phone && (
            <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <Label className="text-white mb-2">Email</Label>
          <Input
            {...register('email')}
            type="email"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="mario.rossi@email.com"
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-white mb-2">Address</Label>
          <Input
            {...register('address')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Via Roma 12"
          />
        </div>

        <div>
          <Label className="text-white mb-2">City</Label>
          <Input
            {...register('city')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Milano"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Postal Code</Label>
          <Input
            {...register('postal_code')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="20121"
          />
        </div>

        <div className="md:col-span-2">
          <Label className="text-white mb-2">Notes</Label>
          <Textarea
            {...register('notes')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-24"
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
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
        >
          {isLoading ? 'Saving...' : customer ? 'Update Customer' : 'Create Customer'}
        </Button>
      </div>
    </form>
  );
}
