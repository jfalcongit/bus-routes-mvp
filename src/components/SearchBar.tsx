"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Props {
  onFilter: (term: string) => void;
}

export default function SearchBar({ onFilter }: Props) {
  const [term, setTerm] = useState("");
  return (
    <div className="mb-6 flex items-center gap-2">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onFilter(term);
          }
        }}
        placeholder="Buscar por origen o destino..."
        className="w-full rounded-md border border-brand-purple-dark bg-white text-brand-night px-4 py-2 placeholder:text-slate-500 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple"
      />
      <Button variant="primary" onClick={() => onFilter(term)}>
        Search
      </Button>
    </div>
  );
}
