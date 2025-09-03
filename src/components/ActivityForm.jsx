import React from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import StatusSelect from './StatusSelect';
import AssigneeSelect from './AssigneeSelect';
import DatePicker from './DatePicker';

const ActivityForm = ({
  showAddForm,
  setShowAddForm,
  newActivity,
  setNewActivity,
  teamMembers,
  addActivity,
}) => {
  const invalidRange = Boolean(
    newActivity.startDate && newActivity.endDate && new Date(newActivity.endDate) < new Date(newActivity.startDate)
  );

  return (
  <>
    <div className="p-6 border-b border-gray-200 flex items-center justify-between">
      <h3 className="text-lg font-semibold text-gray-900">Nueva Actividad</h3>
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        {showAddForm ? 'Cancelar' : 'Agregar Actividad'}
      </button>
    </div>

    {showAddForm && (
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
            <input
              type="text"
              placeholder="Título de la actividad"
              value={newActivity.name}
              onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio *</label>
            <DatePicker
              value={newActivity.startDate}
              onChange={(val) => setNewActivity({ ...newActivity, startDate: val })}
              rangeSide="start"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin *</label>
            <DatePicker
              value={newActivity.endDate}
              onChange={(val) => setNewActivity({ ...newActivity, endDate: val })}
              rangeSide="end"
            />
            {invalidRange && (
              <p className="mt-1 text-xs text-red-600">La fecha de fin debe ser posterior o igual a la fecha de inicio.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Encargado *</label>
            <AssigneeSelect
              value={newActivity.assignee}
              options={teamMembers}
              onChange={(val) => setNewActivity({ ...newActivity, assignee: val })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estatus</label>
            <StatusSelect
              value={newActivity.status}
              onChange={(val) => setNewActivity({ ...newActivity, status: val })}
            />
          </div>

          

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <textarea
              placeholder="Descripción detallada de la actividad..."
              value={newActivity.description}
              onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-200">
          <button
            onClick={addActivity}
            disabled={invalidRange}
            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${invalidRange ? 'bg-green-600/50 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            <CheckCircle className="w-4 h-4" />
            Crear Actividad
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancelar
          </button>
        </div>
      </div>
    )}
  </>
  );
};

export default ActivityForm;



