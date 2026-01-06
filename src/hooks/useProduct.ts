import * as React from "react";
import { API_BASE } from "../api";
import type { Product } from "../types";


export function useProduct(id: string | undefined) {
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!id) {
      setError("Missing product id");
      setLoading(false);
      return;
    }
    
    const safeId = id;

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      setProduct(null);

      try {
        const res = await fetch(`${API_BASE}/${encodeURIComponent(safeId)}`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const json = (await res.json()) as Product;
        if (!cancelled) setProduct(json);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}
