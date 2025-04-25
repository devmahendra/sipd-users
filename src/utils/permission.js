/**
 * Check if the user has the required permission for the route
 * @param {Object} user - The user object (from JWT or session)
 * @param {string} routeId - The ID of the route (e.g., from routeConfig)
 * @param {string} action - The action to check (e.g., 'r' for read, 'c' for create, etc.)
 * @returns {boolean} - True if the user has permission, false otherwise
 */
const hasPermission = (user, menuId, action) => {
    const permission = user.menus.find(menu => menu.id === Number(menuId));
    return permission && permission[action]; // Checks if permission exists and the action is allowed
};
  
module.exports = { hasPermission };