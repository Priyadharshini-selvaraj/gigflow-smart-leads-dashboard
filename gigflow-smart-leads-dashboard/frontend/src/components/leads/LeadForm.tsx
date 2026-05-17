import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lead, CreateLeadDto, UpdateLeadDto } from '@/types/lead.types';
import { LEAD_STATUSES, LEAD_SOURCES } from '@/utils/formatters';
import { Input, Select, Textarea } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { leadsApi } from '@/api/leads.api';
import toast from 'react-hot-toast';

const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional().or(z.literal('')),
  company: z.string().max(100).optional().or(z.literal('')),
  status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
  source: z.enum(['Website', 'Instagram', 'Referral']),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

type LeadFormData = z.infer<typeof leadSchema>;

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ lead, onSuccess, onCancel }) => {
  const isEdit = !!lead;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: lead?.name ?? '',
      email: lead?.email ?? '',
      phone: lead?.phone ?? '',
      company: lead?.company ?? '',
      status: lead?.status ?? 'New',
      source: lead?.source ?? 'Website',
      notes: lead?.notes ?? '',
    },
  });

  const onSubmit = async (data: LeadFormData) => {
    try {
      if (isEdit && lead) {
        const dto: UpdateLeadDto = { ...data, phone: data.phone || undefined, company: data.company || undefined, notes: data.notes || undefined };
        await leadsApi.update(lead._id, dto);
        toast.success('Lead updated successfully');
      } else {
        const dto: CreateLeadDto = { ...data, phone: data.phone || undefined, company: data.company || undefined, notes: data.notes || undefined };
        await leadsApi.create(dto);
        toast.success('Lead created successfully');
      }
      onSuccess();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to save lead';
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" placeholder="e.g. Rahul Sharma" required error={errors.name?.message} {...register('name')} />
        <Input label="Email Address" type="email" placeholder="e.g. rahul@company.com" required error={errors.email?.message} {...register('email')} />
        <Input label="Phone Number" type="tel" placeholder="e.g. +91-9876543210" error={errors.phone?.message} {...register('phone')} />
        <Input label="Company" placeholder="e.g. TechCorp India" error={errors.company?.message} {...register('company')} />
        <Select label="Status" options={LEAD_STATUSES.map((s) => ({ value: s, label: s }))} error={errors.status?.message} {...register('status')} />
        <Select label="Source" required options={LEAD_SOURCES.map((s) => ({ value: s, label: s }))} error={errors.source?.message} {...register('source')} />
      </div>
      <Textarea label="Notes" placeholder="Add any relevant notes about this lead…" rows={3} error={errors.notes?.message} {...register('notes')} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isSubmitting}>{isEdit ? 'Update Lead' : 'Create Lead'}</Button>
      </div>
    </form>
  );
};
