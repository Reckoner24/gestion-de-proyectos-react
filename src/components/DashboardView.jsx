import React, { useMemo } from 'react';
import DashboardMetrics from './DashboardMetrics';
import { WeeklyProgressChart, AssigneeWorkloadChart } from './Charts';
import GanttChart from './GanttChart';
import { Calendar } from 'lucide-react';

const DashboardView = ({ activities, weeks, teamMembers, icons }) => {
  const weeklyData = useMemo(() => (
    weeks.map((week) => {
      const weekActivities = activities.filter((act) => act.week === week);
      const avgProgress = weekActivities.length > 0
        ? weekActivities.reduce((sum, act) => sum + (act.percentage || 0), 0) / weekActivities.length
        : 0;
      return { week: week.replace('Semana ', 'S'), progreso: Math.round(avgProgress), actividades: weekActivities.length };
    })
  ), [activities, weeks]);

  const assigneeData = useMemo(() => (
    teamMembers.map((member) => {
      const memberActivities = activities.filter((act) => act.assignee === member);
      const memberSubActivities = activities.flatMap((act) => act.subActivities?.filter((sub) => sub.assignee === member) || []);
      const totalTasks = memberActivities.length + memberSubActivities.length;
      const completedTasks = memberActivities.filter((act) => act.status === 'concluido').length +
        memberSubActivities.filter((sub) => sub.status === 'concluido').length;
      return { name: member.split(' ')[0], total: totalTasks, completadas: completedTasks, pendientes: totalTasks - completedTasks };
    }).filter((data) => data.total > 0)
  ), [activities, teamMembers]);

  return (
    <>
      <DashboardMetrics
        activities={activities}
        teamMembers={teamMembers}
        TargetIcon={icons.Target}
        ClockIcon={icons.Clock}
        UsersIcon={icons.Users}
        CheckCircleIcon={icons.CheckCircle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {activities.length > 0 ? (
          <>
            <WeeklyProgressChart data={weeklyData} />
            {assigneeData.length > 0 && <AssigneeWorkloadChart data={assigneeData} />}
          </>
        ) : (
          <div className="col-span-2 bg-white p-8 rounded-lg shadow-sm border text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600">No hay actividades aún</h3>
            <p className="text-sm text-gray-500 mt-2">Crea tu primera actividad para ver los gráficos</p>
          </div>
        )}
      </div>

      {activities.length > 0 && <GanttChart activities={activities} />}
    </>
  );
};

export default DashboardView;
