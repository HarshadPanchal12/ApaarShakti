import { createClient } from "@supabase/supabase-js";
export const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
export const API = process.env.NEXT_PUBLIC_API_URL !== undefined 
  ? process.env.NEXT_PUBLIC_API_URL 
  : (typeof window !== "undefined" ? "/api" : "http://localhost:8000");

export async function api(path, opts = {}) {
  const { data } = await sb.auth.getSession();
  const headers = {
    ...(opts.headers || {}),
    Authorization: "Bearer " + (data.session?.access_token || ""),
  };
  const normalizedPath = path.startsWith("/") ? path : "/" + path;
  const url = API ? (API.endsWith("/") ? API.slice(0, -1) : API) + normalizedPath : normalizedPath;
  const r = await fetch(url, { ...opts, headers });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = typeof j.detail === "string" 
      ? j.detail 
      : Array.isArray(j.detail) 
        ? j.detail.map(d => d.msg || JSON.stringify(d)).join(", ") 
        : (j.message || "Request failed");
    throw new Error(msg);
  }
  return j;
}
