import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiPrivate } from '../lib/api-client.js';
import { useGetProducts } from '../hooks/product/useGetProducts.js';
import { getApiErrorMessage } from '../lib/getApiErrorMessage.js';
import { Badge, Button, Card, Field, Input, PageHeader, Select, StatusNote } from './ui.jsx';

const offerKey = ['GET_ADMIN_SPECIAL_OFFER'];

export default function SpecialOfferPage() {
  const queryClient = useQueryClient();
  const { data: products = [] } = useGetProducts();
  const offerQuery = useQuery({
    queryKey: offerKey,
    queryFn: async () => {
      const response = await apiPrivate.get('/special-offer/admin');
      return response.data.data;
    },
  });
  const [form, setForm] = useState({
    enabled: false,
    title: 'Special Offer',
    productId: '',
    offerPrice: '',
    compareAtPrice: '',
  });

  useEffect(() => {
    const offer = offerQuery.data;
    if (!offer) return;
    setForm({
      enabled: Boolean(offer.enabled),
      title: offer.title || 'Special Offer',
      productId: offer.productId || '',
      offerPrice: offer.offerPrice ? String(offer.offerPrice) : '',
      compareAtPrice: offer.compareAtPrice ? String(offer.compareAtPrice) : '',
    });
  }, [offerQuery.data]);

  const saveOffer = useMutation({
    mutationFn: async (payload) => {
      const response = await apiPrivate.patch('/special-offer', payload);
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: offerKey }),
  });

  const selected = products.find((product) => product._id === form.productId);
  const offerPrice = Number(form.offerPrice || 0);
  const compareAtPrice = Number(form.compareAtPrice || selected?.price || 0);
  const savePercent = compareAtPrice > offerPrice && compareAtPrice > 0
    ? Math.round(((compareAtPrice - offerPrice) / compareAtPrice) * 100)
    : 0;

  const handleProduct = (productId) => {
    const product = products.find((item) => item._id === productId);
    setForm((current) => ({
      ...current,
      productId,
      compareAtPrice: product ? String(product.price) : current.compareAtPrice,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveOffer.mutate({
      enabled: form.enabled,
      title: form.title,
      productId: form.productId,
      offerPrice: Number(form.offerPrice),
      compareAtPrice: Number(form.compareAtPrice || 0),
    });
  };

  return (
    <section className="grid gap-5">
      <PageHeader
        eyebrow="Marketing"
        title="Special offer"
        description="This card appears in the shop cart. Turn it off to hide it from every customer."
        action={
          offerQuery.data?.isLive
            ? <Badge tone="gold">Live</Badge>
            : <Badge tone="gray">Hidden</Badge>
        }
      />

      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <label className="flex items-center gap-3 rounded-xl bg-[#F7F4EE] px-4 py-3 font-['Circe'] text-sm">
            <input
              type="checkbox"
              checked={form.enabled}
              onChange={(event) => setForm((current) => ({ ...current, enabled: event.target.checked }))}
              className="h-4 w-4 accent-[#4372B8]"
            />
            Show the special offer in the cart
          </label>
          <Field label="Title">
            <Input
              required
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Special Offer"
            />
          </Field>
          <Field label="Product">
            <Select required value={form.productId} onChange={(event) => handleProduct(event.target.value)}>
              <option value="">Choose a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.title} — ${Number(product.price).toFixed(2)}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Offer price">
              <Input
                required
                type="number"
                min="0.01"
                step="0.01"
                value={form.offerPrice}
                onChange={(event) => setForm((current) => ({ ...current, offerPrice: event.target.value }))}
                placeholder="48.00"
              />
            </Field>
            <Field label="Compare-at price" hint="Shown as the crossed-out price">
              <Input
                type="number"
                min="0"
                step="0.01"
                value={form.compareAtPrice}
                onChange={(event) => setForm((current) => ({ ...current, compareAtPrice: event.target.value }))}
                placeholder="60.00"
              />
            </Field>
          </div>

          {selected && (
            <div className="rounded-2xl bg-[#FEF9E3] p-4">
              <p className="font-['Circe'] text-[11px] font-semibold tracking-[0.12em] text-[#4372B8] uppercase">Cart preview</p>
              <div className="mt-3 flex gap-3">
                {selected.image?.[0]?.url && (
                  <img src={selected.image[0].url} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                )}
                <div className="min-w-0">
                  <p className="font-gelica text-lg text-[#4372B8]">{form.title || 'Special Offer'}</p>
                  <p className="font-['Circe'] text-sm">{selected.title}</p>
                  <p className="mt-1 font-['Circe'] text-sm">
                    <span className="font-semibold text-[#4372B8]">${offerPrice ? offerPrice.toFixed(2) : '0.00'}</span>
                    {compareAtPrice > offerPrice && (
                      <span className="ml-2 text-[#7A8BA3] line-through">${compareAtPrice.toFixed(2)}</span>
                    )}
                    {savePercent > 0 && <span className="ml-2 text-[#3E5A30]">(save {savePercent}%)</span>}
                  </p>
                </div>
              </div>
            </div>
          )}

          {offerQuery.data?.isLive ? (
            <StatusNote tone="success">Live in the shop cart.</StatusNote>
          ) : (
            <StatusNote>Hidden until it is turned on with a product and price.</StatusNote>
          )}
          {saveOffer.isError && <StatusNote tone="danger">{getApiErrorMessage(saveOffer.error)}</StatusNote>}
          {saveOffer.isSuccess && <StatusNote tone="success">Saved. The shop cart will use this offer.</StatusNote>}
          <Button type="submit" disabled={saveOffer.isPending} className="w-full sm:w-fit">
            {saveOffer.isPending ? 'Saving...' : 'Save special offer'}
          </Button>
        </form>
      </Card>
    </section>
  );
}
