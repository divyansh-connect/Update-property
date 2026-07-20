import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../api';
import { PageHeader } from '../../../components/PageHeader';
import { PermissionMatrix } from '../components/PermissionMatrix';

export const RolesPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: roles = [], isLoading: loadingRoles } = useQuery({
    queryKey: ['rbac-roles-list'],
    queryFn: () => api.roles.getAll(),
  });

  const { data: groups = [], isLoading: loadingGroups } = useQuery({
    queryKey: ['rbac-permission-groups'],
    queryFn: () => api.permissions.getGroups(),
  });

  const handleToggle = (roleId: string, permissionKey: string) => {
    alert(`Toggle permission "${permissionKey}" for role ${roleId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Configure role based access controls (RBAC), modify system permissions, and customize functional parameters."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Admin' }, { label: 'Roles' }]}
      />

      {loadingRoles || loadingGroups ? (
        <div className="h-40 flex items-center justify-center text-muted-foreground">Loading Matrix...</div>
      ) : (
        <PermissionMatrix
          roles={roles}
          permissionGroups={groups}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
};
export default RolesPage;
