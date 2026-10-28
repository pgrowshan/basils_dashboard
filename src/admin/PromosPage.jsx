import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiPrivate } from '../lib/api-client.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';

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
    <section>
      <h2 className="font-gelica text-3xl">Promo codes</h2>
      <p className="mt-2 font-['Circe'] text-sm text-[#5C6B82]">Percent or fixed discounts. Customers apply the code at checkout.</p>
      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 bg-white p-5 md:grid-cols-2">
        <input required value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="Code, for example WELCOME10" className="border border-[#D7DEE8] px-3 py-2 font-['Circe']" />
        <select value={form.discountType} onChange={(event) => setForm({ ...form, discountType: event.target.value })} className="border border-[#D7DEE8] px-3 py-2 font-['Circe']">
          <option value="percent">Percent off</option>
          <option value="fixed">Fixed amount off</option>
        </select>
        <input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} placeholder="Amount" className="border border-[#D7DEE8] px-3 py-2 font-['Circe']" />
        <input type="number" min="0" step="0.01" value={form.minSubtotal} onChange={(event) => setForm({ ...form, minSubtotal: event.target.value })} placeholder="Minimum subtotal" className="border border-[#D7DEE8] px-3 py-2 font-['Circe']" />
        {createPromo.isError && <p className="font-['Circe'] text-sm text-red-600 md:col-span-2">{getApiErrorMessage(createPromo.error)}</p>}
        <button type="submit" disabled={createPromo.isPending} className="w-fit cursor-pointer bg-[#4372B8] px-4 py-2 font-['Circe'] text-white disabled:opacity-50">Add code</button>
      </form>

      <div className="mt-6 grid gap-3">
        {(promos.data || []).map((promo) => (
          <article key={promo._id} className="flex flex-wrap items-center justify-between gap-3 bg-white p-4">
            <div>
              <p className="font-['Circe'] font-semibold">{promo.code}</p>
              <p className="font-['Circe'] text-sm text-[#5C6B82]">
                {promo.discountType === 'percent' ? `${promo.amount}% off` : `$${Number(promo.amount).toFixed(2)} off`}
                {promo.minSubtotal ? ` · minimum $${Number(promo.minSubtotal).toFixed(2)}` : ''}
              </p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => updatePromo.mutate({ id: promo._id, payload: { active: !promo.active } })} className="cursor-pointer border border-[#D7DEE8] px-3 py-2 font-['Circe'] text-sm">
                {promo.active ? 'Turn off' : 'Turn on'}
              </button>
              <button type="button" onClick={() => deletePromo.mutate(promo._id)} className="cursor-pointer border border-red-200 px-3 py-2 font-['Circe'] text-sm text-red-600">Delete</button>
            </div>
          </article>
        ))}
        {promos.isSuccess && promos.data.length === 0 && <p className="font-['Circe'] text-sm text-[#5C6B82]">No promo codes yet.</p>}
      </div>
    </section>
  );
}
