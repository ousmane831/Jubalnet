import React from 'react';
import { 
  Users, 
  Shield, 
  UserCheck, 
  Crown
} from 'lucide-react';
import { User } from '../../types';

interface RoleBadgeProps {
  user: User;
  showPermissions?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ 
  user, 
  showPermissions = true, 
  size = 'md',
  className = ''
}) => {
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

  const getRoleInfo = (role: string) => {
    const roles: { [key: string]: { 
      label: string; 
      color: string; 
      gradient: string; 
      icon: any;
      permissions: string[];
      description: string;
    } } = {
      citizen: {
        label: 'Citoyen',
        color: 'blue',
        gradient: 'from-blue-500 to-blue-600',
        icon: Users,
        permissions: [
          'Signaler des crimes',
          'Voir ses propres signalements',
          'Commenter (si autorisé)',
          'Suivre l\'état de ses signalements'
        ],
        description: 'Peut signaler des crimes et suivre ses plaintes'
      },
      authority: {
        label: 'Autorité',
        color: 'green',
        gradient: 'from-green-500 to-green-600',
        icon: Shield,
        permissions: [
          'Voir les signalements assignés',
          'Mettre à jour le statut',
          'Ajouter des commentaires',
          'Transférer les cas',
          'Accéder aux informations de contact'
        ],
        description: 'Gère les signalements dans sa juridiction'
      },
      moderator: {
        label: 'Modérateur',
        color: 'orange',
        gradient: 'from-orange-500 to-orange-600',
        icon: UserCheck,
        permissions: [
          'Voir tous les signalements',
          'Modérer les commentaires',
          'Gérer les catégories',
          'Assigner les cas',
          'Voir les statistiques'
        ],
        description: 'Supervise et modère la plateforme'
      },
      admin: {
        label: 'Administrateur',
        color: 'purple',
        gradient: 'from-purple-500 to-purple-600',
        icon: Crown,
        permissions: [
          'Accès complet à la plateforme',
          'Gérer les utilisateurs',
          'Configurer les départements',
          'Accéder aux statistiques',
          'Gérer les catégories',
          'Exporter les données',
          'Supprimer des contenus'
        ],
        description: 'Contrôle total de la plateforme'
      },
    };
    return roles[role] || roles.citizen;
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3';
      case 'lg':
        return 'h-6 w-6';
      default:
        return 'h-4 w-4';
    }
  };

  const roleInfo = getRoleInfo(user.role);
  const IconComponent = roleInfo.icon;

  return (
    <div className={`role-badge ${className}`}>
      {/* Badge principal */}
      <div className={`inline-flex items-center space-x-2 rounded-full bg-gradient-to-r ${roleInfo.gradient} text-white ${getSizeClasses()} font-semibold shadow-lg`}>
        <IconComponent className={getIconSize()} />
        <span>{roleInfo.label}</span>
        {user.department && (
          <span className="ml-1 opacity-75">• {getDepartmentName(user.department)}</span>
        )}
      </div>

      {/* Informations détaillées */}
      {showPermissions && (
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${roleInfo.gradient} text-white`}>
              <IconComponent className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{roleInfo.label}</h4>
              <p className="text-sm text-gray-600">{roleInfo.description}</p>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <h5 className="text-sm font-semibold text-gray-700 mb-2">Permissions:</h5>
            <div className="grid grid-cols-1 gap-2">
              {roleInfo.permissions.map((permission, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span>{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Informations additionnelles */}
          {user.badge_number && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-medium text-gray-700">Matricule:</span>
                <span className="text-gray-600">{user.badge_number}</span>
              </div>
            </div>
          )}

          {user.jurisdiction_region && (
            <div className="mt-2 flex items-center space-x-2 text-sm">
              <span className="font-medium text-gray-700">Juridiction:</span>
              <span className="text-gray-600">
                {user.jurisdiction_region}
                {user.jurisdiction_department && ` - ${user.jurisdiction_department}`}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RoleBadge;
