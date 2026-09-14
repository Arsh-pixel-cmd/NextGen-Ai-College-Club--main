import { useState, useMemo } from 'react';
import { useEvents, useEventMutations } from '@/hooks/useEvents';
import { sortEventsChronologically } from '@/lib/dateUtils';
import type { Event } from '@/types/content';
import ContentForm, { type FormField } from './ContentForm';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const fields: FormField[] = [
  { name: 'name', label: 'Event Name', type: 'text', placeholder: 'AI Hackathon', required: true },
  { name: 'date', label: 'Date', type: 'text', placeholder: 'Oct 26, 2026', required: true },
  { name: 'venue', label: 'Venue', type: 'text', placeholder: 'Room 404, Tech Hall' },
  { name: 'details', label: 'Details', type: 'textarea', placeholder: 'Event description...' },
  { name: 'display_order', label: 'Display Order', type: 'number', placeholder: '1', required: true },
];

const EventManager = () => {
  const { data: events, isLoading, error } = useEvents();
  const { createEvent, updateEvent, deleteEvent } = useEventMutations();

  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Event | null>(null);
  const [saving, setSaving] = useState(false);

  // Compute next order sequentially based on existing events
  const nextDisplayOrder = useMemo(() => {
    if (!events || events.length === 0) return 1;
    return Math.max(...events.map((e) => Number(e.display_order) || 0)) + 1;
  }, [events]);

  // Sort events chronologically in ascending order
  const sortedEvents = useMemo(() => {
    if (!events) return [];
    return sortEventsChronologically(events);
  }, [events]);

  const handleAdd = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleSubmit = async (values: Record<string, string | number>) => {
    setSaving(true);
    try {
      const payload = {
        name: String(values.name),
        date: String(values.date),
        venue: String(values.venue),
        details: String(values.details),
        display_order: Number(values.display_order) || nextDisplayOrder,
      };
      if (editingEvent) {
        await updateEvent.mutateAsync({ id: editingEvent.id, ...payload });
        toast.success('Event updated successfully');
      } else {
        await createEvent.mutateAsync(payload);
        toast.success('Event added successfully');
      }
      setFormOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteEvent.mutateAsync(deleteConfirm.id);
      toast.success('Event deleted');
      setDeleteConfirm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-[#39FF14]/30 border-t-[#39FF14] rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400 py-12">
        <p>Failed to load events</p>
        <p className="text-sm text-gray-500 mt-1">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-sm">{events?.length || 0} events</p>
        <Button onClick={handleAdd} className="bg-[#39FF14] text-black font-semibold hover:bg-[#39FF14]/90 gap-2">
          <Plus className="w-4 h-4" />
          Add Event
        </Button>
      </div>

      <div className="bg-[#141414] rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Venue</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Order</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {sortedEvents?.map((event) => (
                <tr key={event.id} className="hover:bg-gray-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-white text-sm font-medium">{event.name}</p>
                      <p className="text-gray-500 text-xs">{event.date}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {event.venue}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm text-center">{event.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(event)} className="text-gray-400 hover:text-white hover:bg-gray-700 h-8 w-8 p-0">
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(event)} className="text-gray-400 hover:text-red-400 hover:bg-red-400/10 h-8 w-8 p-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!sortedEvents || sortedEvents.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-gray-500 text-sm">
                    No events yet. Click "Add Event" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ContentForm
        key={editingEvent ? `edit-${editingEvent.id}` : 'new-event'}
        open={formOpen}
        onOpenChange={(isOpen) => {
          setFormOpen(isOpen);
          if (!isOpen) setEditingEvent(null);
        }}
        title={editingEvent ? 'Edit Event' : 'Add Event'}
        fields={fields}
        initialValues={
          editingEvent
            ? {
                name: editingEvent.name,
                date: editingEvent.date,
                venue: editingEvent.venue,
                details: editingEvent.details,
                display_order: editingEvent.display_order,
              }
            : {
                display_order: nextDisplayOrder,
              }
        }
        onSubmit={handleSubmit}
        loading={saving}
      />

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-[#1C1C1C] border-gray-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Event</DialogTitle>
          </DialogHeader>
          <p className="text-gray-400 text-sm">
            Are you sure you want to delete "<strong className="text-white">{deleteConfirm?.name}</strong>"?
          </p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteConfirm(null)} className="text-gray-400 hover:text-white hover:bg-gray-800">Cancel</Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EventManager;
