// Simple hook to generate unique IDs
export function useId(): string {
  return `id-${Math.random().toString(36).substring(2, 9)}`;
}
