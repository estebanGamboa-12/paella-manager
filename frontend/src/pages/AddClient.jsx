import { useState } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddClient() {
  const navigate = useNavigate();

  // Datos del cliente
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [telefono, setTelefono] = useState("");

  // Paellas dinámicas
  const [paellas, setPaellas] = useState([
    { personas: 2, con_fianza: true, importe_fianza: 10 },
  ]);

  const handleAddPaella = () => {
    setPaellas([...paellas, { personas: 2, con_fianza: true, importe_fianza: 10 }]);
  };

  const handleRemovePaella = (index) => {
    setPaellas(paellas.filter((_, i) => i !== index));
  };

  const handleChangePaella = (index, field, value) => {
    const updated = [...paellas];
    updated[index][field] = value;
    if (field === "con_fianza" && !value) {
      updated[index].importe_fianza = 0;
    } else if (field === "con_fianza" && value) {
      updated[index].importe_fianza = 10;
    }
    setPaellas(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/clients/", {
        nombre,
        apellidos,
        telefono,
        paellas,
      });
      alert("Cliente registrado correctamente ✅");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ Error al registrar cliente");
    }
  };

  const total = paellas.reduce((acc, p) => acc + (p.con_fianza ? p.importe_fianza : 0), 0);

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        📝 Registrar nuevo cliente
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos personales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            className="border rounded-lg p-2 w-full"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Apellidos"
            className="border rounded-lg p-2 w-full"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
        </div>
        <input
          type="text"
          placeholder="Teléfono (opcional)"
          className="border rounded-lg p-2 w-full"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />

        {/* Lista de paellas */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">🍲 Paellas</h3>

          {paellas.map((paella, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Personas:</label>
                <select
                  value={paella.personas}
                  onChange={(e) =>
                    handleChangePaella(index, "personas", parseInt(e.target.value))
                  }
                  className="border rounded-md p-1"
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i + 2} value={i + 2}>
                      {i + 2}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-gray-700 font-medium">Fianza:</label>
                <input
                  type="checkbox"
                  checked={paella.con_fianza}
                  onChange={(e) =>
                    handleChangePaella(index, "con_fianza", e.target.checked)
                  }
                />
                <span className="text-gray-600 text-sm">
                  {paella.con_fianza ? "Con fianza (10€)" : "Sin fianza"}
                </span>
              </div>

              {paellas.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePaella(index)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddPaella}
            className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
          >
            ➕ Añadir otra paella
          </button>
        </div>

        {/* Total */}
        <div className="text-center text-lg font-semibold mt-4">
          💶 Total fianzas: <span className="text-blue-600">{total} €</span>
        </div>

        {/* Botón submit */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Guardar cliente
          </button>
        </div>
      </form>
    </div>
  );
}
