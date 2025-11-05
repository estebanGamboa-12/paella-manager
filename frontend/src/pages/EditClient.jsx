import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function EditClient() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await API.get(`/clients/${id}`);
        setClient(res.data);
      } catch (err) {
        alert("Error cargando datos");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const updateField = (field, value) => {
    setClient({ ...client, [field]: value });
  };

  const updatePaella = (index, field, value) => {
    const updated = [...client.paellas];
    updated[index][field] = value;
    setClient({ ...client, paellas: updated });
  };

  const addPaella = () => {
    setClient({
      ...client,
      paellas: [...client.paellas, { personas: 2, con_fianza: true, importe_fianza: 10 }],
    });
  };

  const removePaella = (index) => {
    setClient({
      ...client,
      paellas: client.paellas.filter((_, i) => i !== index),
    });
  };

  const handleSave = async () => {
    try {
      await API.put(`/clients/${id}`, client);
      alert("Guardado ✅");
      navigate("/");
    } catch (err) {
      alert("No se pudo guardar ❌");
    }
  };

  if (loading || !client) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">✏ Editar Cliente</h1>

      <input
        type="text"
        value={client.nombre}
        onChange={(e) => updateField("nombre", e.target.value)}
        placeholder="Nombre"
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <input
        type="text"
        value={client.apellidos}
        onChange={(e) => updateField("apellidos", e.target.value)}
        placeholder="Apellidos"
        className="w-full border px-3 py-2 rounded mb-3"
      />

      <input
        type="text"
        value={client.telefono}
        onChange={(e) => updateField("telefono", e.target.value)}
        placeholder="Teléfono"
        className="w-full border px-3 py-2 rounded mb-6"
      />

      <h2 className="font-semibold mb-3">🍲 Paellas</h2>

      {client.paellas.map((p, index) => (
        <div key={index} className="border p-3 rounded mb-3 bg-gray-50">
          <label className="text-sm block">Personas</label>
          <input
            type="number"
            min="2"
            max="12"
            value={p.personas}
            onChange={(e) => updatePaella(index, "personas", parseInt(e.target.value))}
            className="border px-2 py-1 rounded mb-2 w-full"
          />

          <label className="text-sm block">Fianza</label>
          <select
            value={p.con_fianza}
            onChange={(e) => updatePaella(index, "con_fianza", e.target.value === "true")}
            className="border px-2 py-1 rounded mb-2 w-full"
          >
            <option value="true">Con Fianza</option>
            <option value="false">Sin Fianza</option>
          </select>

          {p.con_fianza && (
            <>
              <label className="text-sm block">Importe (€)</label>
              <input
                type="number"
                value={p.importe_fianza}
                onChange={(e) => updatePaella(index, "importe_fianza", parseFloat(e.target.value))}
                className="border px-2 py-1 rounded mb-2 w-full"
              />
            </>
          )}

          <button
            onClick={() => removePaella(index)}
            className="text-red-600 text-sm mt-1"
          >
            🗑 Eliminar paella
          </button>
        </div>
      ))}

      <button onClick={addPaella} className="bg-blue-500 text-white px-4 py-2 rounded w-full mb-4">
        ➕ Añadir otra paella
      </button>

      <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded w-full">
        Guardar Cambios ✅
      </button>
    </div>
  );
}
