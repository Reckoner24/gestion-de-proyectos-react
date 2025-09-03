import React from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar } from 'recharts';

export const WeeklyProgressChart = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso por Semana</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="progreso" stroke="#3B82F6" strokeWidth={3} name="% Progreso" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export const AssigneeWorkloadChart = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Carga de Trabajo por Persona</h3>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completadas" fill="#10B981" name="Completadas" />
        <Bar dataKey="pendientes" fill="#F59E0B" name="Pendientes" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
