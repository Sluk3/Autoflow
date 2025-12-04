import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CatalogForm({ catalogItem, onSubmit, onCancel, isLoading }) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: catalogItem || {
      make: '',
      model: '',
      year_from: '',
      year_to: '',
      engine_code: '',
      displacement_lt: '',
      fuel_type: '',
      original_power_hp: '',
      original_torque_nm: '',
      stage1_power_hp: '',
      stage1_torque_nm: '',
      stage1_price_eur: '',
      notes: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label className="text-white mb-2">Make *</Label>
          <Input
            {...register('make', { required: 'Make is required' })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Volkswagen"
          />
          {errors.make && (
            <p className="text-red-400 text-sm mt-1">{errors.make.message}</p>
          )}
        </div>

        <div>
          <Label className="text-white mb-2">Model *</Label>
          <Input
            {...register('model', { required: 'Model is required' })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="Golf"
          />
          {errors.model && (
            <p className="text-red-400 text-sm mt-1">{errors.model.message}</p>
          )}
        </div>

        <div>
          <Label className="text-white mb-2">Year From</Label>
          <Input
            {...register('year_from')}
            type="number"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="2019"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Year To</Label>
          <Input
            {...register('year_to')}
            type="number"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="2023"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Engine Code</Label>
          <Input
            {...register('engine_code')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="2.0 TDI"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Displacement (L)</Label>
          <Input
            {...register('displacement_lt')}
            type="number"
            step="0.1"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="2.0"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Fuel Type</Label>
          <Select
            value={watch('fuel_type')}
            onValueChange={(value) => setValue('fuel_type', value)}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Petrol">Petrol</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-white mb-2">Original Power (HP)</Label>
          <Input
            {...register('original_power_hp')}
            type="number"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="150"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Original Torque (Nm)</Label>
          <Input
            {...register('original_torque_nm')}
            type="number"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="320"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Stage 1 Power (HP)</Label>
          <Input
            {...register('stage1_power_hp')}
            type="number"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="190"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Stage 1 Torque (Nm)</Label>
          <Input
            {...register('stage1_torque_nm')}
            type="number"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="400"
          />
        </div>

        <div>
          <Label className="text-white mb-2">Stage 1 Price (€)</Label>
          <Input
            {...register('stage1_price_eur')}
            type="number"
            step="0.01"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            placeholder="690.00"
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
          {isLoading ? 'Saving...' : catalogItem ? 'Update Item' : 'Create Item'}
        </Button>
      </div>
    </form>
  );
}