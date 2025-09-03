import React from 'react';

const GanttChart = ({ activities }) => {
  if (activities.length === 0) return null;

  const minDate = new Date(Math.min(...activities.map(a => new Date(a.startDate))));
  const maxDate = new Date(Math.max(...activities.map(a => new Date(a.endDate))));
  const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Diagrama de Gantt</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-1 mb-2">
            <div className="col-span-4 font-medium text-sm text-gray-700">Actividad</div>
            <div className="col-span-2 font-medium text-sm text-gray-700">Encargado</div>
            <div className="col-span-1 font-medium text-sm text-gray-700">%</div>
            <div className="col-span-5 font-medium text-sm text-gray-700">Cronograma</div>
          </div>

          {activities.map(activity => {
            const startDate = new Date(activity.startDate);
            const endDate = new Date(activity.endDate);
            const startOffset = Math.floor((startDate - minDate) / (1000 * 60 * 60 * 24));
            const duration = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
            const width = (duration / totalDays) * 100;
            const leftOffset = (startOffset / totalDays) * 100;

            return (
              <div key={activity.id}>
                <div className="grid grid-cols-12 gap-1 py-2 border-b border-gray-100">
                  <div className="col-span-4 text-sm font-medium">{activity.name}</div>
                  <div className="col-span-2 text-sm text-gray-600">
                    {activity.assignee?.split(' ')[0]}
                  </div>
                  <div className="col-span-1 text-sm font-medium">{activity.percentage}%</div>
                  <div className="col-span-5 relative">
                    <div className="h-6 bg-gray-100 rounded relative">
                      <div
                        className={`absolute top-0 h-full rounded ${
                          activity.status === 'concluido' ? 'bg-green-500' :
                          activity.status === 'en progreso' ? 'bg-yellow-500' : 'bg-red-400'
                        }`}
                        style={{ left: `${leftOffset}%`, width: `${width}%` }}
                      >
                        <div
                          className="h-full bg-white rounded opacity-30"
                          style={{ width: `${activity.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {activity.subActivities?.map(sub => (
                  <div key={sub.id} className="grid grid-cols-12 gap-1 py-1 border-b border-gray-50">
                    <div className="col-span-4 text-sm text-gray-600 pl-4">↳ {sub.name}</div>
                    <div className="col-span-2 text-sm text-gray-500">{sub.assignee?.split(' ')[0]}</div>
                    <div className="col-span-1 text-sm">{sub.percentage}%</div>
                    <div className="col-span-5 relative">
                      <div className="h-4 bg-gray-50 rounded relative">
                        <div
                          className={`absolute top-0 h-full rounded opacity-70 ${
                            sub.status === 'concluido' ? 'bg-green-400' :
                            sub.status === 'en progreso' ? 'bg-yellow-400' : 'bg-red-300'
                          }`}
                          style={{ left: `${leftOffset}%`, width: `${width * 0.8}%` }}
                        >
                          <div
                            className="h-full bg-white rounded opacity-40"
                            style={{ width: `${sub.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
