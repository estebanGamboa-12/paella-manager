import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API } from "../api/api";

export default function Ticket() {
  const { id } = useParams();
  const [client, setClient] = useState(null);

  useEffect(() => {
    const load = async () => {
      const res = await API.get(`/clients/${id}`);
      setClient(res.data);
    };
    load();
  }, [id]);

  if (!client) return <p className="text-center mt-10">Cargando...</p>;

  const totalFianza = client.paellas
    .filter((p) => p.con_fianza)
    .reduce((acc, p) => acc + p.importe_fianza, 0);

  return (
    <div className="max-w-sm mx-auto mt-8 bg-white p-6 shadow-lg rounded-lg print:shadow-none print:border print:border-black">
      <h1 className="text-center text-xl font-bold mb-4">🍲 Recibo de Paellas</h1>

      <p><strong>Cliente:</strong> {client.nombre} {client.apellidos}</p>
      {client.telefono && <p><strong>Tel:</strong> {client.telefono}</p>}
      <p><strong>Fecha:</strong> {new Date(client.fecha_creacion).toLocaleString("es-ES")}</p>

      <hr className="my-4" />

      <h2 className="font-semibold">Detalle de paellas:</h2>
      <ul className="text-sm mt-2 space-y-1">
        {client.paellas.map((p) => (
          <li key={p.id}>
            • {p.personas} personas —{" "}
            {p.con_fianza ? `Fianza: ${p.importe_fianza}€` : "Sin fianza"}
          </li>
        ))}
      </ul>

      <hr className="my-4" />

      <p className="text-lg font-bold text-right">
        Total fianza: <span className="text-blue-600">{totalFianza} €</span>
      </p>

      <button
        onClick={() => window.print()}
        className="w-full mt-6 bg-black text-white py-2 rounded-lg print:hidden"
      >
        Imprimir 🧾
      </button>
    </div>
  );
}
