import { users } from './mockData/users';
import { User } from '../types';

/**
 * Check if a user is authenticated
 * @param {User | null} user - The user object from AuthContext
 * @returns {boolean} - True if the user is authenticated
 */
export const isAuthenticated = (user: User | null): boolean => {
  return !!user;
};

/**
 * Check if a user has admin role
 * @param {User | null} user - The user object from AuthContext
 * @returns {boolean} - True if the user has admin role
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.role === 'admin';
};

/**
 * Check if a user has HR role
 * @param {User | null} user - The user object from AuthContext
 * @returns {boolean} - True if the user has HR role
 */
export const isHR = (user: User | null): boolean => {
  return user?.role === 'hr';
};

/**
 * Check if a user has HR or admin role
 * @param {User | null} user - The user object from AuthContext
 * @returns {boolean} - True if the user has HR or admin role
 */
export const isHRorAdmin = (user: User | null): boolean => {
  return user?.role === 'hr' || user?.role === 'admin';
};

/**
 * Check if a user has the required role
 * @param {User | null} user - The user object from AuthContext
 * @param {string} requiredRole - The required role
 * @returns {boolean} - True if the user has the required role or is admin
 */
export const hasRole = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false;
  return user.role === requiredRole || user.role === 'admin';
};

/**
 * Check if a user has the required permission
 * @param {User | null} user - The user object from AuthContext
 * @param {string} permission - The required permission
 * @returns {boolean} - True if the user has the required permission
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;
  return user.permissions.includes(permission) || user.permissions.includes('all');
};

/**
 * Check if a user has all the required permissions
 * @param {User | null} user - The user object from AuthContext
 * @param {string[]} permissions - The required permissions
 * @returns {boolean} - True if the user has all the required permissions
 */
export const hasAllPermissions = (user: User | null, permissions: string[]): boolean => {
  if (!user) return false;
  if (user.permissions.includes('all')) return true;
  return permissions.every(permission => user.permissions.includes(permission));
};

/**
 * Check if a user is the owner of a resource
 * @param {User | null} user - The user object from AuthContext
 * @param {string} resourceOwnerId - The ID of the resource owner
 * @returns {boolean} - True if the user is the owner of the resource
 */
export const isResourceOwner = (user: User | null, resourceOwnerId: string): boolean => {
  if (!user) return false;
  return user.id === resourceOwnerId;
};

/**
 * Check if a user can view a resource
 * @param {User | null} user - The user object from AuthContext
 * @param {string} resourceOwnerId - The ID of the resource owner
 * @returns {boolean} - True if the user can view the resource
 */
export const canViewResource = (user: User | null, resourceOwnerId: string): boolean => {
  if (!user) return false;
  
  // Admin and HR can view all resources
  if (user.role === 'admin' || user.role === 'hr') return true;
  
  // Regular employee can only view own resources
  return user.id === resourceOwnerId;
};

/**
 * Check if a user can edit a resource
 * @param {User | null} user - The user object from AuthContext
 * @param {string} resourceOwnerId - The ID of the resource owner
 * @returns {boolean} - True if the user can edit the resource
 */
export const canEditResource = (user: User | null, resourceOwnerId: string): boolean => {
  if (!user) return false;
  
  // Admin and HR can edit all resources
  if (user.role === 'admin' || user.role === 'hr') return true;
  
  // Regular employee can only edit own resources
  return user.id === resourceOwnerId && hasPermission(user, 'edit_self');
};

/**
 * Find user by credentials
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {User | undefined} - The user object if found, undefined otherwise
 */
export const findUserByCredentials = (email: string, password: string): User | undefined => {
  return users.find(user => user.email === email && user.password === password);
};

/**
 * Find user by ID
 * @param {string} id - The user's ID
 * @returns {User | undefined} - The user object if found, undefined otherwise
 */
export const findUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};