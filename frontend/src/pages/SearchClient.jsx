import { useState } from "react";
import { API } from "../api/api";
import ClientCard from "../components/ClientCard";

export default function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await API.get(`/clients/search/?q=${query}`);
    setResults(res.data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Buscar cliente</h2>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nombre, apellidos o teléfono"
          className="flex-1 border rounded px-3 py-2"
        />
        <button className="bg-primary text-white px-4 py-2 rounded">Buscar</button>
      </form>

      {results.length === 0 ? (
        <p>No hay resultados.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((c) => (
            <ClientCard key={c.id} client={c} />
          ))}
        </div>
      )}
    </div>
  );
}
