import { useState } from "react";
import { client as supabase } from "../supabase/client";

export function useClientAutocomplete(handleChange) {
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleIdInputChange = async (e) => {
    const { value } = e.target;
    handleChange(e);

    if (!value || !/^\d+$/.test(value)) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSearch(true);

    const min = Number(value);
    const max = Number(value + "9".repeat(10 - value.length));

    const { data, error } = await supabase
      .from("Cliente")
      .select("*")
      .gte("dni", min)
      .lte("dni", max)
      .limit(20);

    setLoadingSearch(false);

    if (error) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = (data || []).filter(cliente =>
      String(cliente.dni).startsWith(value)
    );

    if (filtered.length > 0) {
      setSearchResults(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  };

  return {
    searchResults,
    showSuggestions,
    loadingSearch,
    setShowSuggestions,
    handleIdInputChange,
    setSearchResults,
  };
}