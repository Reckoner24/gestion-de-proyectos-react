import React from 'react';

const DashboardMetrics = ({ activities, teamMembers, TargetIcon, ClockIcon, UsersIcon, CheckCircleIcon }) => {
  const generalProgress = activities.length > 0
    ? Math.round(activities.reduce((sum, act) => sum + (act.percentage || 0), 0) / activities.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Progreso General</p>
            <p className="text-2xl font-bold text-blue-600">{generalProgress}%</p>
          </div>
          <TargetIcon className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Actividades Activas</p>
            <p className="text-2xl font-bold text-green-600">
              {activities.filter(act => act.status === 'en progreso').length}
            </p>
          </div>
          <ClockIcon className="w-8 h-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Miembros del Equipo</p>
            <p className="text-2xl font-bold text-purple-600">{teamMembers.length}</p>
          </div>
          <UsersIcon className="w-8 h-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Sub-actividades</p>
            <p className="text-2xl font-bold text-orange-600">
              {activities.reduce((sum, act) => sum + (act.subActivities?.length || 0), 0)}
            </p>
          </div>
          <CheckCircleIcon className="w-8 h-8 text-orange-600" />
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;
