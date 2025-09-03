import React from 'react';
import ActivityForm from './ActivityForm';
import TeamBar from './TeamBar';
import ActivityItem from './ActivityItem';

const ActivitiesList = ({
  activities,
  expandedActivities,
  toggleExpanded,
  addSubActivity,
  deleteActivity,
  updateActivityPercentage,
  showAddForm,
  setShowAddForm,
  newActivity,
  setNewActivity,
  teamMembers,
  addActivity,
  newTeamMember,
  setNewTeamMember,
  addTeamMember,
  removeTeamMember,
}) => (
  <div className="space-y-6">
    <div className="bg-white rounded-lg shadow-sm border">
      <ActivityForm
        showAddForm={showAddForm}
        setShowAddForm={setShowAddForm}
        newActivity={newActivity}
        setNewActivity={setNewActivity}
        teamMembers={teamMembers}
        addActivity={addActivity}
      />

      <TeamBar
        teamMembers={teamMembers}
        newTeamMember={newTeamMember}
        setNewTeamMember={setNewTeamMember}
        addTeamMember={addTeamMember}
        removeTeamMember={removeTeamMember}
      />
    </div>

    {activities.length > 0 ? (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actividades ({activities.length})</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              expanded={expandedActivities.has(activity.id)}
              onToggle={() => toggleExpanded(activity.id)}
              onDelete={() => deleteActivity(activity.id)}
              onAddSub={() => addSubActivity(activity.id)}
              onUpdatePercentage={(val, isSub = false, subId = null) => {
                if (isSub && subId != null) {
                  updateActivityPercentage(subId, val);
                } else {
                  updateActivityPercentage(activity.id, val);
                }
              }}
            />
          ))}
        </div>
      </div>
    ) : (
      <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
        <p className="text-gray-600 text-lg">No hay actividades creadas</p>
        <p className="text-sm text-gray-500 mt-2">Haz clic en "Agregar Actividad" para comenzar</p>
      </div>
    )}
  </div>
);

export default ActivitiesList;


