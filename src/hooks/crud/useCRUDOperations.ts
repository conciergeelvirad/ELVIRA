import { useState, useCallback } from "react";

export interface CRUDOperations<T> {
  create: (data: Partial<T>) => Promise<void>;
  update: (id: string | number, data: Partial<T>) => Promise<void>;
  delete: (id: string | number) => Promise<void>;
}

export const useCRUDOperations = <T extends { id: string | number }>(
  items: T[],
  setItems: (items: T[]) => void,
  customOperations?: Partial<CRUDOperations<T>>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: Partial<T>) => {
      setIsLoading(true);
      setError(null);

      try {
        if (customOperations?.create) {
          await customOperations.create(data);
        } else {
          // Default create logic (local state only)
          const newItem = {
            ...data,
            id: Date.now().toString(),
            createdAt: new Date().toISOString().split("T")[0],
          } as unknown as T;
          setItems([...items, newItem]);
        }
      } catch (err) {
        console.error("❌ CREATE failed:", err);
        setError(err instanceof Error ? err.message : "Failed to create item");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [items, setItems, customOperations]
  );

  const update = useCallback(
    async (id: string | number, data: Partial<T>) => {
      setIsLoading(true);
      setError(null);

      try {
        if (customOperations?.update) {
          await customOperations.update(id, data);
        } else {
          // Default update logic (local state only)
          setItems(
            items.map((item) => (item.id === id ? { ...item, ...data } : item))
          );
        }
      } catch (err) {
        console.error("❌ UPDATE failed:", err);
        setError(err instanceof Error ? err.message : "Failed to update item");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [items, setItems, customOperations]
  );

  const deleteItem = useCallback(
    async (id: string | number) => {
      setIsLoading(true);
      setError(null);

      try {
        if (customOperations?.delete) {
          await customOperations.delete(id);
        } else {
          // Default delete logic (local state only)
          setItems(items.filter((item) => item.id !== id));
        }
      } catch (err) {
        console.error("❌ DELETE failed:", err);
        setError(err instanceof Error ? err.message : "Failed to delete item");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [items, setItems, customOperations]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    create,
    update,
    delete: deleteItem,
    isLoading,
    error,
    clearError,
  };
};
