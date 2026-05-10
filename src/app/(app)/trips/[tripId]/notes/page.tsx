import React from 'react';
import { getNotes } from './actions';
import NotesEditorClient from './notes-editor-client';

export default async function NotesPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = await params;
  const content = await getNotes(tripId);
  return <NotesEditorClient tripId={tripId} initialContent={content} />;
}
