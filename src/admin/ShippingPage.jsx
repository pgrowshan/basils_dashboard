import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiPrivate } from '../lib/api-client.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Badge, Button, Card, Field, Input, PageHeader, StatusNote } from './ui.jsx';

const ratesKey = ['GET_ADMIN_SHIPPING_RATES'];

function toForm(rates) {
  return rates.map((rate) => ({ ...rate, price: String(rate.price) }));
}

function RatesForm({ rates }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => toForm(rates));
  const [localError, setLocalError] = useState('');

  const save = useMutation({
    mutationFn: async (payload) => {
      const response = await apiPrivate.put('/shipping', payload);
      return response.data.data;
    },
    onSuccess: (saved) => {
      queryClient.setQueryData(ratesKey, saved);
      queryClient.invalidateQueries({ queryKey: ['GET_SHIPPING_RATES'] });
    },
  });

  const update = (code, key, value) => {
    save.reset();
    setForm((current) => current.map((rate) => (rate.code === code ? { ...rate, [key]: value } : rate)));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLocalError('');
    if (!form.some((rate) => rate.enabled)) {
      setLocalError('Keep at least one shipping option turned on.');
      return;
    }
    save.mutate({
      rates: form.map((rate) => ({
        code: rate.code,
        label: rate.label.trim(),
        price: Number(rate.price),
        eta: rate.eta.trim(),
        enabled: rate.enabled,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {form.map((rate) => (
        <Card key={rate.code}>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="font-gelica text-xl text-[#1A2744]">{rate.code === 'express' ? 'Express' : 'Standard'}</p>
            {rate.enabled ? <Badge tone="green">Shown at checkout</Badge> : <Badge tone="gray">Hidden</Badge>}
          </div>
          <div className="grid gap-4">
            <label className="flex items-center gap-3 rounded-xl bg-[#F7F4EE] px-4 py-3 font-circe text-sm">
              <input
                type="checkbox"
                checked={rate.enabled}
                onChange={(event) => update(rate.code, 'enabled', event.target.checked)}
                className="h-4 w-4 accent-[#4372B8]"
              />
              Offer this option at checkout
            </label>
            <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
              <Field label="Name shown to customers">
                <Input
                  required
                  maxLength={60}
                  value={rate.label}
                  onChange={(event) => update(rate.code, 'label', event.target.value)}
                />
              </Field>
              <Field label="Price (CAD)">
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={rate.price}
                  onChange={(event) => update(rate.code, 'price', event.target.value)}
                />
              </Field>
            </div>
            <Field label="Delivery estimate" hint="Shown under the option, e.g. Estimated Delivery 5-7 days">
              <Input
                maxLength={80}
                value={rate.eta}
                onChange={(event) => update(rate.code, 'eta', event.target.value)}
              />
            </Field>
          </div>
        </Card>
      ))}

      {localError && <StatusNote tone="danger">{localError}</StatusNote>}
      {save.isError && <StatusNote tone="danger">{getApiErrorMessage(save.error)}</StatusNote>}
      {save.isSuccess && <StatusNote tone="success">Saved. New orders use these rates right away.</StatusNote>}
      <Button type="submit" disabled={save.isPending} className="w-full sm:w-fit">
        {save.isPending ? 'Saving...' : 'Save shipping rates'}
      </Button>
    </form>
  );
}

export default function ShippingPage() {
  const ratesQuery = useQuery({
    queryKey: ratesKey,
    queryFn: async () => {
      const response = await apiPrivate.get('/shipping/admin');
      return response.data.data;
    },
  });

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Checkout"
        title="Shipping rates"
        description="Set the price and delivery estimate for each option. The amount is added to the order total; orders already placed keep the rate they paid."
      />
      {ratesQuery.isLoading && <StatusNote>Loading shipping rates…</StatusNote>}
      {ratesQuery.isError && <StatusNote tone="danger">{getApiErrorMessage(ratesQuery.error)}</StatusNote>}
      {ratesQuery.data && <RatesForm key={ratesQuery.dataUpdatedAt} rates={ratesQuery.data} />}
    </section>
  );
}
