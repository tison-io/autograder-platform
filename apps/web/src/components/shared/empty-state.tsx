import { FileQuestion, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: 'inbox' | 'file';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = 'inbox', title, description, action }: EmptyStateProps) {
  const Icon = icon === 'inbox' ? Inbox : FileQuestion;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Icon className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center max-w-sm mb-6">{description}</p>
      {action && <Button onClick={action.onClick}>{action.label}</Button>}
    </div>
  );
}

export function EmptyCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <EmptyState title={title} description={description} />
    </div>
  );
}
