import React from 'react';
import { getPackingItems } from './actions';
import PackingListClient from './packing-list-client';

export default async function PackingPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const items = await getPackingItems(tripId);
  return <PackingListClient tripId={tripId} initialItems={items} />;
}
