"use client";

import { Button } from "@/components/ui/button";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";

/**
 * Props del componente SearchBar
 * @interface Props
 * @property {string} filter - Término de búsqueda actual
 * @property {function} onFilter - Función callback que se ejecuta cuando cambia el filtro
 */
interface Props {
  filter: string;
  onFilter: (term: string) => void;
}

/**
 * Componente de barra de búsqueda con debounce
 *
 * Permite al usuario filtrar contenido mientras escribe y muestra
 * un botón para limpiar la búsqueda cuando hay texto.
 */
export default function SearchBar({ filter, onFilter }: Props) {
  // Estado local para manejar el valor del input
  const [term, setTerm] = useState(filter);

  // Función de filtrado con debounce para evitar múltiples llamadas
  const debouncedFilter = useCallback(
    debounce((value: string) => {
      onFilter(value.trim());
    }, 100),
    [onFilter]
  );

  // Aplica el filtro cuando cambia el término de búsqueda
  useEffect(() => {
    debouncedFilter(term);
    return () => {
      debouncedFilter.cancel();
    };
  }, [term, debouncedFilter]);

  // Sincroniza el estado local con el prop filter
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
