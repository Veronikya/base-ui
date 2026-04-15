// Copyright (c) 2026 Aptlogica Technologies Private Limited
// SPDX-License-Identifier: MIT
// Websites: https://www.aptlogica.com | https://www.serenibase.com
// Support: support@aptlogica.com | support@serenibase.com
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AddUserModal } from './AddUserModal';
import { useToast } from '../../common/Toast';
import { useGetTenantUsers, useRemoveTenantUser, useActivateTenantUser, useDeactivateTenantUser } from '../../../hooks/useApi';
import { UserTable, TenantUser } from '../../shared/UserTable';
import { Plus } from 'lucide-react';
import { Loader } from '../../ui/Loader';

interface UserSettingsTabProps {
  workspaceId: string;
}

export const UserSettingsTab: React.FC<UserSettingsTabProps> = () => {
  const { t } = useTranslation(['common', 'workspace']);
  const { data: tenantUsers = [], isLoading, error } = useGetTenantUsers();
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TenantUser | null>(null);
  const toast = useToast();
  const removeTenantUserMutation = useRemoveTenantUser();
  const activateTenantUserMutation = useActivateTenantUser();
  const deactivateTenantUserMutation = useDeactivateTenantUser();

  // Filter out owner users
  const nonOwnerUsers = useMemo(() => {
    return tenantUsers.filter((u: any) => u.roles !== 'owner');
  }, [tenantUsers]);

  const handleRemoveUser = async (userId: string) => {
    try {
      await removeTenantUserMutation.mutateAsync(userId);
      toast.success(t('common:toast.userRemoved'));
    } catch (error: any) {
      toast.error(t('common:errors.failedToRemoveUser'));
    }
  };

  const handleEditUser = (user: TenantUser) => {
    setEditingUser(user);
    setIsAddUserModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddUserModalOpen(false);
    setEditingUser(null);
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await activateTenantUserMutation.mutateAsync(userId);
      toast.success(t('common:toast.userActivated'));
    } catch (error: any) {
      toast.error(t('common:errors.failedToActivateUser'));
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    try {
      await deactivateTenantUserMutation.mutateAsync(userId);
      toast.success(t('common:toast.userDeactivated'));
    } catch (error: any) {
      toast.error(t('common:errors.failedToDeactivateUser'));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size={6} text={t('workspace:user.loadingUsers')} textPosition='bottom' />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-red-600 mb-2">{t('workspace:user.errorLoadingUsers')}</p>
          <p className="text-sm text-secondary">{String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* User Table */}
      <UserTable
        users={nonOwnerUsers as TenantUser[]}
        onRemoveUser={handleRemoveUser}
        onEditUser={handleEditUser}
        onActivateUser={handleActivateUser}
        onDeactivateUser={handleDeactivateUser}
        showSearch={true}
        headerActions={
          <button
            onClick={() => {
              setEditingUser(null);
              setIsAddUserModalOpen(true);
            }}
            className="px-4 py-2 btn-primary flex items-center gap-1 transition font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            {t('workspace:addUser.title')}
          </button>
        }
      />

      {/* Add/Edit User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={handleCloseModal}
        editUser={editingUser}
      />
    </div>
  );
};
