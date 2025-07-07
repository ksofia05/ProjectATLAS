import { useState } from "react";
import { client as supabase } from "../supabase/client";

export function useClientAutocomplete(handleChange, idproyecto) {
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleIdInputChange = async (e) => {
    const { value } = e.target;
    handleChange(e);

    console.log("Valor:", value);
    console.log("ID Proyecto:", idproyecto);
    console.log("Condición:", !value || !/^\d+$/.test(value) || !idproyecto);

    if (!value || !/^\d+$/.test(value) || !idproyecto) {
      console.log("Saliendo temprano de la búsqueda");
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    setLoadingSearch(true);

    try {
      console.log("Patrón de búsqueda:", value);

      // Tuve que realizar el filtro desde JavaScript porque supabase no corre cuando escribo un prefijo
      const { data, error } = await supabase
        .from("Cliente")
        .select("*")
        .eq("proyecto", parseInt(idproyecto))
        .limit(1000); // El filtro funciona hasta con 1000 clientes por proyecto

      console.log("Datos de Supabase:", data);
      console.log("Error de Supabase:", error);

      setLoadingSearch(false);

      if (error) {
        console.error("Error en búsqueda:", error);
        setSearchResults([]);
        setShowSuggestions(false);
        return;
      }

      const allResults = data || [];

      // Filtro por prefijo de DNI
      const filteredResults = allResults.filter((cliente) => {
        const dniStr = cliente.dni.toString();
        return dniStr.startsWith(value);
      });

      console.log("Resultados filtrados:", filteredResults);
      console.log(
        "Llamando setSearchResults con:",
        filteredResults.slice(0, 5)
      );

      if (filteredResults.length > 0) {
        setSearchResults(filteredResults.slice(0, 5));
        setShowSuggestions(true);
      } else {
        console.log("No se encontraron resultados, limpiando búsqueda");
        setSearchResults([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error("Error en la consulta:", error);
      setLoadingSearch(false);
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
