import React from "react";
import { API } from "../api/api";

export default function ClientCard({ client, onStatusChange }) {
  // 🔹 Calcular total real según paellas
  const total = client.paellas
    ? client.paellas.reduce(
        (acc, p) => acc + (p.con_fianza ? p.importe_fianza : 0),
        0
      )
    : 0;

  // ✅ Marcar como devuelto
  const handleMarkReturned = async () => {
    if (!window.confirm("¿Confirmas que este cliente ha devuelto las paellas?")) return;

    try {
      await API.put(`/clients/${client.id}/return`);
      alert("Cliente marcado como devuelto ✅");
      onStatusChange(); // 🔁 refresca la lista en el padre (Home)
    } catch (err) {
      console.error(err);
      alert("❌ Error al marcar como devuelto");
    }
  };

  return (
    <div
      className={`p-5 rounded-xl shadow-md mb-4 border transition ${
        client.devuelto ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-blue-700">
            {client.nombre} {client.apellidos}
          </h3>
          <p className="text-gray-600 text-sm">
            📞 {client.telefono || "Sin teléfono"}
          </p>
        </div>

        {/* Estado visual */}
        <span
          className={`px-3 py-1 text-sm rounded-full font-medium ${
            client.devuelto
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {client.devuelto ? "Devuelta" : "Pendiente"}
        </span>
      </div>

      {/* Lista de paellas */}
      <ul className="mt-3 text-sm text-gray-700 space-y-1">
        {client.paellas?.map((p, i) => (
          <li key={i}>
            🍲 Paella de {p.personas} personas —{" "}
            {p.con_fianza ? (
              <span className="text-green-600 font-medium">
                con fianza ({p.importe_fianza} €)
              </span>
            ) : (
              <span className="text-gray-500">sin fianza</span>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-3 font-semibold text-gray-800">
        💰 Total fianzas:{" "}
        <span className="text-blue-600">{total.toFixed(2)} €</span>
      </div>

      {/* Botón marcar devuelta */}
      {!client.devuelto && (
        <button
          onClick={handleMarkReturned}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Marcar como devuelta ✅
        </button>
      )}
    </div>
  );
}
