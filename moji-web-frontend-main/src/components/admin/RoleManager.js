import React from "react";
import { FaTrash } from "react-icons/fa";

const RoleManager = ({ roles, onRolesChange }) => {
  const handleAddRole = () => {
    onRolesChange([...roles, { roleName: "Debater", slots: 0, price: 0 }]);
  };

  const handleRemoveRole = (index) => {
    onRolesChange(roles.filter((_, i) => i !== index));
  };

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const newRoles = [...roles];
    newRoles[index][name] = value;
    onRolesChange(newRoles);
  };

  return (
    <div className="space-y-4">
      {roles.map((role, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role Name</label>
              <select
                name="roleName"
                value={role.roleName}
                onChange={(e) => handleChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="Debater">Debater</option>
                <option value="Adjudicator">Adjudicator</option>
                <option value="Observer">Observer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Slots</label>
              <input
                type="number"
                name="slots"
                value={role.slots}
                onChange={(e) => handleChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (VND)</label>
              <input
                type="number"
                name="price"
                value={role.price}
                onChange={(e) => handleChange(index, e)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                min="0"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleRemoveRole(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddRole}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        + Add Role
      </button>
    </div>
  );
};

export default RoleManager; 