import React from 'react';

const TeamBar = ({ teamMembers, newTeamMember, setNewTeamMember, addTeamMember, removeTeamMember }) => (
  <div className="p-4 bg-blue-50 border-t">
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700">Equipo:</span>
      <div className="flex flex-wrap gap-2">
        {teamMembers.map((member) => (
          <span key={member} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm inline-flex items-center gap-2">
            {member}
            <button
              type="button"
              aria-label={`Quitar ${member}`}
              title={`Quitar ${member}`}
              className="ml-1 text-blue-700/70 hover:text-blue-900"
              onClick={() => removeTeamMember(member)}
            >
              ×
            </button>
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
          onKeyDown={(e) => e.key === 'Enter' && addTeamMember()}
        />
        <button onClick={addTeamMember} className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
          +
        </button>
      </div>
    </div>
  </div>
);

export default TeamBar;
