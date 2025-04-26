// src/components/SearchBar.tsx
"use client";

import { Button } from "@/components/ui/button";

interface Props {
  filter: string;
  onFilter: (term: string) => void;
}

export default function SearchBar({ filter, onFilter }: Props) {
  return (
    <div className="mb-6 flex items-center gap-2">
      <input
        type="text"
        value={filter}
        onChange={(e) => onFilter(e.target.value)}
        placeholder="Buscar por origen o destino..."
        className="w-full rounded-md border border-brand-purple-dark bg-white text-brand-night px-4 py-2 placeholder:text-slate-500 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple"
      />
      {filter && (
        <Button variant="secondary" onClick={() => onFilter("")}>
          ✕
        </Button>
      )}
    </div>
  );
}
