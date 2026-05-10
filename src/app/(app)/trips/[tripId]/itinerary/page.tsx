import React from 'react';
import { getStops } from './actions';
import ItineraryClient from './itinerary-client';

export default async function ItineraryPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const stops = await getStops(tripId);
  return <ItineraryClient tripId={tripId} initialStops={stops} />;
}
