import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function AddClient() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");
  const [paellas, setPaellas] = useState([
    { personas: 2, con_fianza: true, importe_fianza: 10 },
  ]);

  const addPaella = () => {
    setPaellas([
      ...paellas,
      { personas: 2, con_fianza: true, importe_fianza: 10 },
    ]);
  };

  const updatePaella = (index, field, value) => {
    const updated = [...paellas];
    updated[index][field] = value;
    setPaellas(updated);
  };

  const removePaella = (index) => {
    setPaellas(paellas.filter((_, i) => i !== index));
  };

  const totalFianza = paellas
    .filter((p) => p.con_fianza)
    .reduce((acc, p) => acc + Number(p.importe_fianza), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/clients/", {
        nombre,
        apellidos,
        telefono,
        paellas,
      });
      alert("Cliente guardado ✅");
      navigate("/");
    } catch (error) {
      alert("Error guardando ❌");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">➕ Nuevo Cliente</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          placeholder="Nombre"
          className="w-full border rounded-lg px-4 py-2"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Apellidos"
          className="w-full border rounded-lg px-4 py-2"
          value={apellidos}
          onChange={(e) => setApellidos(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Teléfono (opcional)"
          className="w-full border rounded-lg px-4 py-2"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        <h2 className="font-semibold text-lg mt-6">🍲 Paellas</h2>

        {paellas.map((p, index) => (
          <div key={index} className="border rounded-lg p-4 bg-gray-50 space-y-2 relative">

            <label className="block text-sm font-medium text-gray-700">
              Tamaño (personas)
            </label>
            <input
              type="number"
              min="2"
              max="12"
              value={p.personas}
              onChange={(e) => updatePaella(index, "personas", parseInt(e.target.value))}
              className="w-full border rounded-lg px-3 py-1"
            />

            <label className="block text-sm font-medium text-gray-700">Fianza</label>
            <select
              value={p.con_fianza}
              onChange={(e) => updatePaella(index, "con_fianza", e.target.value === "true")}
              className="w-full border rounded-lg px-3 py-1"
            >
              <option value="true">Con fianza</option>
              <option value="false">Sin fianza</option>
            </select>

            {p.con_fianza && (
              <>
                <label className="block text-sm font-medium text-gray-700">Importe (€)</label>
                <input
                  type="number"
                  value={p.importe_fianza}
                  onChange={(e) => updatePaella(index, "importe_fianza", parseFloat(e.target.value))}
                  className="w-full border rounded-lg px-3 py-1"
                />
              </>
            )}

            {paellas.length > 1 && (
              <button
                type="button"
                onClick={() => removePaella(index)}
                className="text-red-600 text-sm mt-2"
              >
                🗑 Eliminar paella
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addPaella}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
        >
          ➕ Añadir otra paella
        </button>

        <p className="text-right font-semibold text-gray-700">
          💰 Total fianza: <span className="text-blue-600">{totalFianza} €</span>
        </p>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-lg font-semibold transition"
        >
          Guardar ✅
        </button>

      </form>
    </div>
  );
}
