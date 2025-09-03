import React from 'react';
import { ChevronDown, ChevronRight, Trash2 } from 'lucide-react';

const ActivityItem = ({
  activity,
  expanded,
  onToggle,
  onDelete,
  onAddSub,
  onUpdatePercentage,
}) => (
  <div className="p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <button onClick={onToggle} className="text-gray-400 hover:text-gray-600">
          {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
        <div>
          <h4 className="font-medium text-gray-900">{activity.name}</h4>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>📅 {activity.startDate} - {activity.endDate}</span>
            <span>👤 {activity.assignee}</span>
            <span className="px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-2">
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  activity.status === 'concluido'
                    ? 'bg-green-500'
                    : activity.status === 'en progreso'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
              <span className={`${
                activity.status === 'concluido'
                  ? 'text-green-700'
                  : activity.status === 'en progreso'
                  ? 'text-yellow-700'
                  : 'text-red-700'
              }`}>
                {activity.status === 'concluido' ? 'Concluido' : activity.status === 'en progreso' ? 'En progreso' : 'Pendiente'}
              </span>
            </span>
          </div>
          {activity.description && <p className="text-sm text-gray-600 mt-2">{activity.description}</p>}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-sm font-medium">{activity.percentage}%</div>
          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full ${
                activity.status === 'concluido' ? 'bg-green-500' :
                activity.status === 'en progreso' ? 'bg-yellow-500' : 'bg-red-400'
              }`}
              style={{ width: `${activity.percentage}%` }}
            />
          </div>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="10"
          value={activity.percentage}
          onChange={(e) => onUpdatePercentage(parseInt(e.target.value))}
          className="w-20"
        />
        <button onClick={onAddSub} className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-600 rounded">
          + Sub
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800 p-1" title="Eliminar actividad">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    {expanded && activity.subActivities?.length > 0 && (
      <div className="ml-8 space-y-2">
        {activity.subActivities.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h5 className="font-medium text-gray-800">{sub.name}</h5>
              <span className="text-sm text-gray-500">👤 {sub.assignee}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">{sub.percentage}%</div>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    sub.status === 'concluido' ? 'bg-green-500' :
                    sub.status === 'en progreso' ? 'bg-yellow-500' : 'bg-red-400'
                  }`}
                  style={{ width: `${sub.percentage}%` }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={sub.percentage}
                onChange={(e) => onUpdatePercentage(parseInt(e.target.value), true, sub.id)}
                className="w-16"
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ActivityItem;
