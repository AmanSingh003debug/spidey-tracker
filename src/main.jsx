import React from "react";
import ReactDOM from "react-dom/client";
import { createClient } from "@supabase/supabase-js";
import App from "./App.jsx";

/*
 
*/
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function stripPrefix(key) {
  return key.startsWith("day:") ? key.slice(4) : key;
}

window.storage = {
  async get(key) {
    const dateKey = stripPrefix(key);
    const { data, error } = await supabase
      .from("days")
      .select("data")
      .eq("date", dateKey)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Key not found: " + key);
    return { key, value: JSON.stringify(data.data), shared: false };
  },
  async set(key, value) {
    const dateKey = stripPrefix(key);
    const { error } = await supabase
      .from("days")
      .upsert({ date: dateKey, data: JSON.parse(value), updated_at: new Date().toISOString() });
    if (error) throw error;
    return { key, value, shared: false };
  },
  async delete(key) {
    const dateKey = stripPrefix(key);
    const { error } = await supabase.from("days").delete().eq("date", dateKey);
    if (error) throw error;
    return { key, deleted: true, shared: false };
  },
  async list(prefix = "") {
    const { data, error } = await supabase.from("days").select("date");
    if (error) throw error;
    const dateKeys = (data || []).map(row => "day:" + row.date);
    const filtered = prefix ? dateKeys.filter(k => k.startsWith(prefix)) : dateKeys;
    return { keys: filtered, prefix, shared: false };
  }
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
