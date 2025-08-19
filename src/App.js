import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import { Plus, Trash2, CheckCircle, Clock, AlertCircle, Users, Calendar, ChevronDown, ChevronRight, Target } from 'lucide-react';

const AdvancedProjectTracker = () => {
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    name: '',
    priority: 'media',
    week: 'Semana 1',
    startDate: '',
    endDate: '',
    assignee: '',
    dependencies: [],
    description: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTeamMember, setNewTeamMember] = useState('');
  const [teamMembers, setTeamMembers] = useState(['Juan Pérez', 'María García', 'Carlos López']);
  const [expandedActivities, setExpandedActivities] = useState(new Set());
  const [activeView, setActiveView] = useState('dashboard');

  const weeks = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
  const priorities = ['alta', 'media', 'baja'];

  const addActivity = () => {
    if (!newActivity.name.trim() || !newActivity.startDate || !newActivity.endDate || !newActivity.assignee) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const id = Math.max(...activities.map(a => a.id), 0) + 1;
    const activity = {
      ...newActivity,
      id,
      status: 'pendiente',
      percentage: 0,
      subActivities: []
    };

    setActivities([...activities, activity]);
    setNewActivity({
      name: '',
      priority: 'media',
      week: 'Semana 1',
      startDate: '',
      endDate: '',
      assignee: '',
      dependencies: [],
      description: ''
    });
    setShowAddForm(false);
  };

  const addTeamMember = () => {
    if (newTeamMember.trim() && !teamMembers.includes(newTeamMember.trim())) {
      setTeamMembers([...teamMembers, newTeamMember.trim()]);
      setNewTeamMember('');
    }
  };

  const deleteActivity = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta actividad?')) {
      setActivities(activities.filter(act => act.id !== id));
    }
  };

  const toggleExpanded = (activityId) => {
    const newExpanded = new Set(expandedActivities);
    if (newExpanded.has(activityId)) {
      newExpanded.delete(activityId);
    } else {
      newExpanded.add(activityId);
    }
    setExpandedActivities(newExpanded);
  };

  const addSubActivity = (parentId) => {
    const subActivityName = prompt('Nombre de la sub-actividad:');
    if (!subActivityName) return;

    const assignee = prompt(`Encargado (disponibles: ${teamMembers.join(', ')}):`);
    if (!assignee) return;

    if (!teamMembers.includes(assignee)) {
      const addMember = window.confirm(`${assignee} no está en el equipo. ¿Quieres agregarlo?`);
      if (addMember) {
        setTeamMembers([...teamMembers, assignee]);
      }
    }

    setActivities(activities.map(activity => {
      if (activity.id === parentId) {
        const newSubId = Math.max(...activity.subActivities.map(s => s.id), parentId * 10) + 1;
        return {
          ...activity,
          subActivities: [
            ...activity.subActivities,
            {
              id: newSubId,
              name: subActivityName,
              status: 'pendiente',
              percentage: 0,
              assignee
            }
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
        else if (percentage === 100) newStatus = 'completada';
        
        return { ...activity, percentage, status: newStatus };
      }
      
      return {
        ...activity,
        subActivities: activity.subActivities.map(sub => {
          if (sub.id === id) {
            let newStatus = 'pendiente';
            if (percentage > 0 && percentage < 100) newStatus = 'en progreso';
            else if (percentage === 100) newStatus = 'completada';
            
            return { ...sub, percentage, status: newStatus };
          }
          return sub;
        })
      };
    }));
  };

  // Datos para gráficos
  const weeklyData = weeks.map(week => {
    const weekActivities = activities.filter(act => act.week === week);
    const avgProgress = weekActivities.length > 0 
      ? weekActivities.reduce((sum, act) => sum + (act.percentage || 0), 0) / weekActivities.length 
      : 0;
    
    return {
      week: week.replace('Semana ', 'S'),
      progreso: Math.round(avgProgress),
      actividades: weekActivities.length
    };
  });

  const assigneeData = teamMembers.map(member => {
    const memberActivities = activities.filter(act => act.assignee === member);
    const memberSubActivities = activities.flatMap(act => 
      act.subActivities?.filter(sub => sub.assignee === member) || []
    );
    
    const totalTasks = memberActivities.length + memberSubActivities.length;
    const completedTasks = memberActivities.filter(act => act.status === 'completada').length +
                          memberSubActivities.filter(sub => sub.status === 'completada').length;
    
    return {
      name: member.split(' ')[0],
      total: totalTasks,
      completadas: completedTasks,
      pendientes: totalTasks - completedTasks
    };
  }).filter(data => data.total > 0);

  const GanttChart = () => {
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
                            activity.status === 'completada' ? 'bg-green-500' :
                            activity.status === 'en progreso' ? 'bg-blue-500' : 'bg-gray-300'
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
                      <div className="col-span-4 text-sm text-gray-600 pl-4">└─ {sub.name}</div>
                      <div className="col-span-2 text-sm text-gray-500">{sub.assignee?.split(' ')[0]}</div>
                      <div className="col-span-1 text-sm">{sub.percentage}%</div>
                      <div className="col-span-5 relative">
                        <div className="h-4 bg-gray-50 rounded relative">
                          <div 
                            className={`absolute top-0 h-full rounded opacity-70 ${
                              sub.status === 'completada' ? 'bg-green-400' :
                              sub.status === 'en progreso' ? 'bg-blue-400' : 'bg-gray-300'
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

  const renderDashboard = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Progreso General</p>
              <p className="text-2xl font-bold text-blue-600">
                {activities.length > 0 ? Math.round(activities.reduce((sum, act) => sum + (act.percentage || 0), 0) / activities.length) : 0}%
              </p>
            </div>
            <Target className="w-8 h-8 text-blue-600" />
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
            <Clock className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Miembros del Equipo</p>
              <p className="text-2xl font-bold text-purple-600">{teamMembers.length}</p>
            </div>
            <Users className="w-8 h-8 text-purple-600" />
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
            <CheckCircle className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {activities.length > 0 ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progreso por Semana</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progreso" stroke="#3B82F6" strokeWidth={3} name="% Progreso" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {assigneeData.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Carga de Trabajo por Persona</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assigneeData}>
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
            )}
          </>
        ) : (
          <div className="col-span-2 bg-white p-8 rounded-lg shadow-sm border text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-600">No hay actividades aún</h3>
            <p className="text-sm text-gray-500 mt-2">Crea tu primera actividad para ver los gráficos</p>
          </div>
        )}
      </div>

      {activities.length > 0 && <GanttChart />}
    </>
  );

  const renderActivitiesList = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de la Actividad *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Desarrollo de módulo de usuarios"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={newActivity.startDate}
                  onChange={(e) => setNewActivity({...newActivity, startDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  value={newActivity.endDate}
                  onChange={(e) => setNewActivity({...newActivity, endDate: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encargado *
                </label>
                <select
                  value={newActivity.assignee}
                  onChange={(e) => setNewActivity({...newActivity, assignee: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar encargado</option>
                  {teamMembers.map(member => (
                    <option key={member} value={member}>{member}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad
                </label>
                <select
                  value={newActivity.priority}
                  onChange={(e) => setNewActivity({...newActivity, priority: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="baja">🟢 Baja</option>
                  <option value="media">🟡 Media</option>
                  <option value="alta">🔴 Alta</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semana
                </label>
                <select
                  value={newActivity.week}
                  onChange={(e) => setNewActivity({...newActivity, week: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {weeks.map(week => (
                    <option key={week} value={week}>{week}</option>
                  ))}
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  placeholder="Descripción detallada de la actividad..."
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                onClick={addActivity}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
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
        
        <div className="p-4 bg-blue-50 border-t">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Equipo:</span>
            <div className="flex flex-wrap gap-2">
              {teamMembers.map(member => (
                <span key={member} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                  {member}
                </span>
              ))}
            </div>
            <div className="flex gap-2 ml-auto">
              <input
                type="text"
                placeholder="Nuevo miembro"
                value={newTeamMember}
                onChange={(e) => setNewTeamMember(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
              />
              <button
                onClick={addTeamMember}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {activities.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Actividades ({activities.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-200">
            {activities.map(activity => (
              <div key={activity.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleExpanded(activity.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedActivities.has(activity.id) ? 
                        <ChevronDown className="w-5 h-5" /> : 
                        <ChevronRight className="w-5 h-5" />
                      }
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">{activity.name}</h4>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>📅 {activity.startDate} - {activity.endDate}</span>
                        <span>👤 {activity.assignee}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.priority === 'alta' ? 'bg-red-100 text-red-800' :
                          activity.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {activity.priority}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mt-2">{activity.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium">{activity.percentage}%</div>
                      <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`h-2 rounded-full ${
                            activity.status === 'completada' ? 'bg-green-500' :
                            activity.status === 'en progreso' ? 'bg-blue-500' : 'bg-gray-300'
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
                      onChange={(e) => updateActivityPercentage(activity.id, parseInt(e.target.value))}
                      className="w-20"
                    />
                    <button
                      onClick={() => addSubActivity(activity.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-600 rounded"
                    >
                      + Sub
                    </button>
                    <button
                      onClick={() => deleteActivity(activity.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Eliminar actividad"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {expandedActivities.has(activity.id) && activity.subActivities?.length > 0 && (
                  <div className="ml-8 space-y-2">
                    {activity.subActivities.map(sub => (
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
                                sub.status === 'completada' ? 'bg-green-500' :
                                sub.status === 'en progreso' ? 'bg-blue-500' : 'bg-gray-300'
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
                            onChange={(e) => updateActivityPercentage(sub.id, parseInt(e.target.value))}
                            className="w-16"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600">No hay actividades creadas</h3>
          <p className="text-sm text-gray-500 mt-2">Haz clic en "Agregar Actividad" para comenzar</p>
        </div>
      )}
    </div>
  );

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
              activeView === 'dashboard' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveView('activities')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeView === 'activities' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Actividades
          </button>
        </nav>
      </div>

      {activeView === 'dashboard' ? renderDashboard() : renderActivitiesList()}
    </div>
  );
};

export default AdvancedProjectTracker;