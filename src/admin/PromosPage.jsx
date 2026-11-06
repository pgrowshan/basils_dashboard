import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiPrivate } from '../lib/api-client.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Badge, Button, Card, EmptyState, Field, Input, PageHeader, Select, StatusNote } from './ui.jsx';

const promoKeys = ['GET_PROMOS'];

async function listPromos() {
  const response = await apiPrivate.get('/promo/admin-fetch-all');
  return response.data.data || [];
}

export default function PromosPage() {
  const queryClient = useQueryClient();
  const promos = useQuery({ queryKey: promoKeys, queryFn: listPromos });
  const [form, setForm] = useState({
    code: '',
    discountType: 'percent',
    amount: '',
    minSubtotal: '0',
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: promoKeys });
  const createPromo = useMutation({
    mutationFn: async (payload) => {
      const response = await apiPrivate.post('/promo/create', payload);
      return response.data;
    },
    onSuccess: refresh,
  });
  const updatePromo = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await apiPrivate.patch(`/promo/update/${id}`, payload);
      return response.data;
    },
    onSuccess: refresh,
  });
  const deletePromo = useMutation({
    mutationFn: async (id) => {
      const response = await apiPrivate.delete(`/promo/${id}`);
      return response.data;
    },
    onSuccess: refresh,
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    createPromo.mutate({
      code: form.code,
      discountType: form.discountType,
      amount: Number(form.amount),
      minSubtotal: Number(form.minSubtotal || 0),
      active: true,
    }, {
      onSuccess: () => setForm({ code: '', discountType: 'percent', amount: '', minSubtotal: '0' }),
    });
  };

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Marketing"
        title="Promo codes"
        description="Percent or fixed discounts. Customers apply the code at checkout."
      />

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Code">
            <Input required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="WELCOME10" />
          </Field>
          <Field label="Discount type">
            <Select value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value })}>
              <option value="percent">Percent off</option>
              <option value="fixed">Fixed amount off</option>
            </Select>
          </Field>
          <Field label="Amount">
            <Input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="10" />
          </Field>
          <Field label="Minimum subtotal">
            <Input type="number" min="0" step="0.01" value={form.minSubtotal} onChange={(event) => setForm({ ...form, minSubtotal: event.target.value })} placeholder="0" />
          </Field>
          {createPromo.isError && <div className="sm:col-span-2"><StatusNote tone="danger">{getApiErrorMessage(createPromo.error)}</StatusNote></div>}
          <Button type="submit" disabled={createPromo.isPending} className="w-full sm:w-fit">
            Add code
          </Button>
        </form>
      </Card>

      <div className="grid gap-3">
        {(promos.data || []).map((promo) => (
          <article key={promo._id} className="flex flex-col gap-3 rounded-2xl border border-[#E6E1D6] bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-circe font-semibold">{promo.code}</p>
                <Badge tone={promo.active ? 'gold' : 'gray'}>{promo.active ? 'Active' : 'Off'}</Badge>
              </div>
              <p className="mt-1 font-circe text-sm text-[#5C6B82]">
                {promo.discountType === 'percent' ? `${promo.amount}% off` : `$${Number(promo.amount).toFixed(2)} off`}
                {promo.minSubtotal ? ` · minimum $${Number(promo.minSubtotal).toFixed(2)}` : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="secondary" onClick={() => updatePromo.mutate({ id: promo._id, payload: { active: !promo.active } })} className="flex-1 sm:flex-none">
                {promo.active ? 'Turn off' : 'Turn on'}
              </Button>
              <Button type="button" variant="danger" onClick={() => deletePromo.mutate(promo._id)} className="flex-1 sm:flex-none">
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
      {promos.isSuccess && promos.data.length === 0 && <EmptyState>No promo codes yet.</EmptyState>}
    </section>
  );
}
