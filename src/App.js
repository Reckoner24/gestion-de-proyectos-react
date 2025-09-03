import React, { useState, useEffect } from 'react';
import { Target, Clock, Users, CheckCircle } from 'lucide-react';
import DashboardView from './components/DashboardView';
import ActivitiesList from './components/ActivitiesList';

const AdvancedProjectTracker = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    status: 'pendiente',
    week: 'Semana 1',
    startDate: '',
    endDate: '',
    assignee: '',
    dependencies: [],
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState('');
  const [teamMembers, setTeamMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('teamMembers');
      return saved ? JSON.parse(saved) : ['Stephanie Gonzalez'];
    } catch (e) {
      return ['Stephanie Gonzalez'];
    }
  });
  const [expandedActivities, setExpandedActivities] = useState(new Set());
  const [activeView, setActiveView] = useState('dashboard');

  const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
  

  const addActivity = () => {
    if (!newActivity.name.trim() || !newActivity.startDate || !newActivity.endDate || !newActivity.assignee) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }
    if (new Date(newActivity.endDate) < new Date(newActivity.startDate)) {
      alert('Rango de fechas inválido: la fecha de fin debe ser posterior o igual a la fecha de inicio.');
      return;
    }

    const id = Math.max(...activities.map(a => a.id), 0) + 1;
    const activity = { ...newActivity, id, percentage: 0, subActivities: [] };
    setActivities([...activities, activity]);
    setNewActivity({ name: '', status: 'pendiente', week: 'Semana 1', startDate: '', endDate: '', assignee: '', dependencies: [], description: '' });
    setShowAddForm(false);
  };

  const addTeamMember = () => {
    const name = newTeamMember.trim();
    if (!name) return;
    const exists = teamMembers.some(m => m.toLowerCase() === name.toLowerCase());
    if (!exists) {
      setTeamMembers([...teamMembers, name]);
    }
    setNewTeamMember('');
  };

  const removeTeamMember = (member) => {
    setTeamMembers(prev => prev.filter(m => m !== member));
    if (newActivity.assignee === member) {
      setNewActivity({ ...newActivity, assignee: '' });
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
    } catch (e) {
      // ignore storage errors
    }
  }, [teamMembers]);

  const deleteActivity = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      setActivities(activities.filter(act => act.id !== id));
    }
  };

  const toggleExpanded = (activityId) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) newExpanded.delete(activityId); else newExpanded.add(activityId);
    setExpandedActivities(newExpanded);
  };

  const addSubActivity = (parentId) => {
    const subActivityName = prompt('Nombre de la sub-actividad:');
    if (!subActivityName) return;

    const assignee = prompt(`Encargado (disponibles: ${teamMembers.join(', ')}):`);
    if (!assignee) return;

    if (!teamMembers.includes(assignee)) {
      const addMember = window.confirm(`${assignee} no está en el equipo. ¿Quieres agregarlo?`);
      if (addMember) setTeamMembers([...teamMembers, assignee]);
    }

    setActivities(activities.map(activity => {
      if (activity.id === parentId) {
        const newSubId = Math.max(...activity.subActivities.map(s => s.id), parentId * 10) + 1;
        return {
          ...activity,
          subActivities: [
            ...activity.subActivities,
            { id: newSubId, name: subActivityName, status: 'pendiente', percentage: 0, assignee }
          ]
        };
      }
      return activity;
    }));
  };

  const updateActivityPercentage = (id, percentage) => {
    setActivities(activities.map(activity => {
      if (activity.id === id) {
        let newStatus = 'pendiente';
        if (percentage > 0 && percentage < 100) newStatus = 'en progreso';
        else if (percentage === 100) newStatus = 'concluido';
        return { ...activity, percentage, status: newStatus };
      }
      return {
        ...activity,
        subActivities: activity.subActivities.map(sub => {
          if (sub.id === id) {
            let newStatus = 'pendiente';
            if (percentage > 0 && percentage < 100) newStatus = 'en progreso';
            else if (percentage === 100) newStatus = 'concluido';
            return { ...sub, percentage, status: newStatus };
          }
          return sub;
        })
      };
    }));
  };

  const icons = { Target, Clock, Users, CheckCircle };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Avanzado de Proyectos</h1>
        <p className="text-gray-600">Gestión completa con Gantt, sub-actividades y seguimiento de equipo</p>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('activities')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === 'activities' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Actividades
          </button>
        </nav>
      </div>

      {activeView === 'dashboard' ? (
        <DashboardView activities={activities} weeks={weeks} teamMembers={teamMembers} icons={icons} />
      ) : (
        <ActivitiesList
          activities={activities}
          expandedActivities={expandedActivities}
          toggleExpanded={toggleExpanded}
          addSubActivity={addSubActivity}
          deleteActivity={deleteActivity}
          updateActivityPercentage={updateActivityPercentage}
          showAddForm={showAddForm}
          setShowAddForm={setShowAddForm}
          newActivity={newActivity}
          setNewActivity={setNewActivity}
          teamMembers={teamMembers}
          addActivity={addActivity}
          newTeamMember={newTeamMember}
          setNewTeamMember={setNewTeamMember}
          addTeamMember={addTeamMember}
          removeTeamMember={removeTeamMember}
        />
      )}
    </div>
  );
};

export default AdvancedProjectTracker;
