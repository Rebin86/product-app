import * as React from "react";
import { API_BASE } from "../api";
import type { Product } from "../types";


type ProductsResponse = {
  products: Product[];
};

export function useProducts() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(API_BASE);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        
        const json = (await res.json()) as ProductsResponse;
        const list = Array.isArray(json?.products) ? json.products : [];
        if (!cancelled) setProducts(list);
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
  }, []);

  return { products, loading, error };
}
