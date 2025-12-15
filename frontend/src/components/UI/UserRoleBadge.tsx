import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RoleBadge from './RoleBadge';
import { User, Mail } from 'lucide-react';
import dscLogo from '../../assets/departments/dsc-logo.png';
import cdpLogo from '../../assets/departments/cdp-logo.png';
import policeLogo from '../../assets/departments/police-logo.png';
import gendarmerieLogo from '../../assets/departments/gendarmerie-logo.png';
import santeLogo from '../../assets/departments/sante-logo.png';
import douaneLogo from '../../assets/departments/douane-logo.png';



interface UserRoleBadgeProps {
  showPermissions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showLabel?: boolean;
  showUserInfo?: boolean;
  logoSize?: number; 
}

export const UserRoleBadge: React.FC<UserRoleBadgeProps> = ({ 
  showPermissions = false, 
  size = 'sm',
  className = '',
  showLabel = true,
  showUserInfo = true,
  logoSize = 68
}) => {
  const { user } = useAuth();

  // Fonction pour obtenir le nom du département en français
  const getDepartmentName = (department?: string | null): string => {
    const departmentNames: { [key: string]: string } = {
      'cdp': 'CDP',
      'dsc': 'DSC', 
      'police': 'Police',
      'gendarmerie': 'Gendarmerie',
      'health': 'Santé',
      'customs_authority': 'Douanes',
    };
    return department ? (departmentNames[department] || department.toUpperCase()) : '';
  };

  // Fonction pour obtenir le logo du département
  const getDepartmentLogo = (department?: string | null): string | undefined => {
    switch (department) {
      case 'dsc': return dscLogo;
      case 'cdp': return cdpLogo;
      case 'police': return policeLogo;
      case 'gendarmerie': return gendarmerieLogo;
      case 'health': return santeLogo;
      case 'customs_authority': return douaneLogo;
      default: return undefined;
    }
  };

  if (!user) return null;

  return (
    <div className={`user-role-badge ${className}`}>
      {showUserInfo && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 mb-3">
          <div className="flex items-start justify-between">
  
  {/* --- Partie gauche (infos utilisateur) --- */}
  <div className="flex items-center space-x-3">
    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-full">
      <User className="h-6 w-6 text-white" />
    </div>

    <div>
      <div className="flex items-center space-x-2">
        <h3 className="font-bold text-gray-900">
          {user.full_name || 'Utilisateur'}
        </h3>
        <RoleBadge 
          user={user} 
          size="sm" 
          showPermissions={false} 
          className="ml-2"
        />
      </div>

      {user.email && (
        <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
          <Mail className="h-4 w-4" />
          <span>{user.email}</span>
        </div>
      )}
    </div>
  </div>

  {/* --- Partie droite : Logo du département --- */}
  {getDepartmentLogo(user.department) && (
    <img
      src={getDepartmentLogo(user.department)!}
      alt="department logo"
      style={{ height: logoSize, width: logoSize }}
      className="h-10 w-10 object-contain"
    />
  )}

</div>

          
          {/* Informations supplémentaires */}
          {(user.badge_number || user.department || user.jurisdiction_region) && (
            <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 gap-2">
              {user.badge_number && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-700">Matricule:</span>
                  <span className="text-gray-600">{user.badge_number}</span>
                </div>
              )}
              {user.department && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-700">Département:</span>
                  <div className="flex items-center space-x-2">
                    {getDepartmentLogo(user.department) && (
                      <img 
                        src={getDepartmentLogo(user.department)!} 
                        alt={`${user.department} logo`}
                        className="h-8 w-8 object-contain"
                      />
                    )}
                    <span className="text-gray-600">{getDepartmentName(user.department)}</span>
                  </div>
                </div>
              )}
              {user.jurisdiction_region && (
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium text-gray-700">Région:</span>
                  <span className="text-gray-600">
                    {user.jurisdiction_region}
                    {user.jurisdiction_department && ` - ${user.jurisdiction_department}`}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {showLabel && !showUserInfo && (
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-600">
            {user.role === 'admin' ? 'Admin:' : 
             user.role === 'moderator' ? 'Modérateur:' : 
             user.role === 'authority' ? 'Autorité:' : 'Citoyen:'}
          </span>
          <RoleBadge 
            user={user} 
            size={size} 
            showPermissions={showPermissions} 
          />
        </div>
      )}
      
      {!showLabel && !showUserInfo && (
        <RoleBadge 
          user={user} 
          size={size} 
          showPermissions={showPermissions} 
        />
      )}
    </div>
  );
};

export default UserRoleBadge;
