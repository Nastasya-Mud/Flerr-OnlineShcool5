import { useToastStore } from '../store';

export const useToast = () => {
  const { addToast } = useToastStore();

  const toast = ({
    title,
    description,
    variant = 'default',
  }: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive' | 'success';
  }) => {
    addToast({ title, description, variant });
  };

  return { toast };
};

