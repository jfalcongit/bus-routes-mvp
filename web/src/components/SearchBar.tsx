"use client";

import { Button } from "@/components/ui/button";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";

interface Props {
  filter: string;
  onFilter: (term: string) => void;
}

export default function SearchBar({ filter, onFilter }: Props) {
  const [term, setTerm] = useState(filter);

  const debouncedFilter = useCallback(
    debounce((value: string) => {
      onFilter(value.trim());
    }, 100),
    [onFilter]
  );

  useEffect(() => {
    debouncedFilter(term);
    return () => {
      debouncedFilter.cancel();
    };
  }, [term, debouncedFilter]);

  useEffect(() => {
    setTerm(filter);
  }, [filter]);

  return (
    <div className="mb-6 flex items-center gap-2">
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Buscar por origen o destino..."
        className="w-full rounded-md border border-brand-purple-dark bg-white text-brand-night px-4 py-2 placeholder:text-slate-500 focus:border-brand-purple focus:ring-2 focus:ring-brand-purple"
      />
      {!!term && (
        <Button variant="secondary" onClick={() => onFilter("")}>
          ✕
        </Button>
      )}
    </div>
  );
}
