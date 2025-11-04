import React from "react";

export default function ClientCard({ client }) {
  // 🔹 Calcular total real según paellas
  const total = client.paellas
    ? client.paellas.reduce(
        (acc, p) => acc + (p.con_fianza ? p.importe_fianza : 0),
        0
      )
    : 0;

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mb-4">
      <h3 className="text-lg font-bold text-blue-700">
        {client.nombre} {client.apellidos}
      </h3>
      <p className="text-gray-600 text-sm">📞 {client.telefono || "Sin teléfono"}</p>

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

      <div className="mt-2">
        {client.devuelto ? (
          <span className="text-green-600 font-semibold">✅ Devuelta</span>
        ) : (
          <span className="text-red-600 font-semibold">⏳ Pendiente</span>
        )}
      </div>
    </div>
  );
}
