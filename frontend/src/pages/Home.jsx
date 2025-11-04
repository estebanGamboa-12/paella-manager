import { useEffect, useState } from "react";
import { API } from "../api/api";
import ClientCard from "../components/ClientCard";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Home() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/clients/")
      .then((res) => setClients(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Fianzas activas</h2>
      {clients.length === 0 ? (
        <p>No hay fianzas registradas.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((c) => (
            <ClientCard key={c.id} client={c} />
          ))}
        </div>
      )}
    </div>
  );
}
