import { useEffect, useState } from "react";
import { API } from "../api/api";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({ pendientes: 0, devueltas: 0, total: 0 });

  useEffect(() => {
    API.get("/clients/").then((res) => {
      const devueltas = res.data.filter((c) => c.devuelto).length;
      const pendientes = res.data.length - devueltas;
      const total = res.data.reduce((acc, c) => acc + (c.importe_total || 0), 0);
      setStats({ pendientes, devueltas, total });
    });
  }, []);

  const data = [
    { name: "Pendientes", value: stats.pendientes },
    { name: "Devueltas", value: stats.devueltas },
  ];
  const COLORS = ["#f87171", "#22c55e"];

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
        📊 <span className="text-blue-600">Resumen general</span>
      </h2>

      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-xl flex flex-col items-center">
        <div className="w-full h-80">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <p className="text-lg font-medium mt-4 text-gray-700">
          💶 <b>Total gestionado:</b> {stats.total.toFixed(2)} €
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-8">
        <div className="bg-green-100 p-4 rounded-xl text-center shadow">
          <h3 className="text-green-700 font-semibold text-xl">Devueltas</h3>
          <p className="text-2xl font-bold text-green-600">{stats.devueltas}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-xl text-center shadow">
          <h3 className="text-red-700 font-semibold text-xl">Pendientes</h3>
          <p className="text-2xl font-bold text-red-600">{stats.pendientes}</p>
        </div>
      </div>
    </div>
  );
}
