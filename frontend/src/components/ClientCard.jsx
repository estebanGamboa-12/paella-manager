import { API } from "../api/api";
import { Link } from "react-router-dom";

export default function ClientCard({ client, onStatusChange, onDelete }) {
  const total = client.paellas?.reduce(
    (acc, p) => acc + (p.con_fianza ? p.importe_fianza : 0),
    0
  );

  const handleMarkReturned = async () => {
    if (!confirm("¿Confirmas la devolución?")) return;
    await API.put(`/clients/${client.id}/return`);
    onStatusChange();
  };

  return (
    <div className={`relative p-5 rounded-xl shadow-md mb-4 border ${client.devuelto ? "bg-green-50" : "bg-white"}`}>

      {/* Encabezado */}
      <div>
        <h3 className="text-lg font-bold text-blue-700">{client.nombre} {client.apellidos}</h3>
        <p className="text-gray-600 text-sm">📞 {client.telefono || "Sin teléfono"}</p>
        <p className="text-gray-500 text-sm">🗓️ {client.fecha_creacion}</p>
      </div>

      {/* Nuevo estado elegante */}
      <div className="absolute right-4 top-4">
        {client.devuelto ? (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 font-medium px-3 py-1 rounded-full text-xs shadow-sm">
            ✅ Devuelta
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-red-100 text-red-600 font-medium px-3 py-1 rounded-full text-xs shadow-sm">
            ⏳ Pendiente
          </span>
        )}
      </div>

      {/* Lista de paellas */}
      <ul className="mt-3 text-sm text-gray-700 space-y-1">
        {client.paellas?.map((p, i) => (
          <li key={i}>🍲 {p.personas} personas — {p.con_fianza ? `Fianza ${p.importe_fianza}€` : "Sin fianza"}</li>
        ))}
      </ul>

      <p className="mt-3 font-semibold text-gray-800">
        💰 Total fianzas: <span className="text-blue-600">{total} €</span>
      </p>

      {/* Acciones */}
      <div className="flex gap-4 mt-4">
        {!client.devuelto && (
          <button onClick={handleMarkReturned} className="text-green-700 hover:underline">
            🔄 Marcar devuelta
          </button>
        )}
        <Link to={`/editar/${client.id}`} className="text-blue-600 hover:underline">✏ Editar</Link>
        <button onClick={() => onDelete(client.id)} className="text-red-600 hover:underline">🗑 Eliminar</button>
        <Link to={`/ticket/${client.id}`} className="text-indigo-600 hover:underline text-sm">🧾 Ticket</Link>
      </div>
    </div>
  );
}
