import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './useDebounce';

interface UseAutoSaveOptions {
  onSave: () => Promise<void>;
  delay?: number;
}

export function useAutoSave({ onSave, delay = 3000 }: UseAutoSaveOptions) {
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  const markDirty = () => {
    setIsDirty(true);
  };

  const save = async () => {
    if (!isDirty || isSaving) return;

    setIsSaving(true);
    try {
      await onSave();
      setIsDirty(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save when dirty after delay
  useEffect(() => {
    if (isDirty && !isSaving) {
      saveTimeoutRef.current = setTimeout(() => {
        save();
      }, delay);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isDirty, isSaving, delay]);

  // Save before unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = 'Você tem alterações não salvas. Deseja sair?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return {
    isDirty,
    isSaving,
    lastSaved,
    markDirty,
    save: () => save(),
  };
}
