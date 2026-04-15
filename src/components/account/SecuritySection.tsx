// Copyright (c) 2026 Aptlogica Technologies Private Limited
// SPDX-License-Identifier: MIT
// Websites: https://www.aptlogica.com | https://www.serenibase.com
// Support: support@aptlogica.com | support@serenibase.com
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthContext';
import { useUserProfile, useChangePassword } from '../../hooks/useApi';
import { useToast } from '../common/Toast';
import { Loader2, Eye, EyeOff, HelpCircle, Monitor, Earth, Clock } from 'lucide-react';
import { getUserActivity, type LoginSession } from '../../service/activityService';
import { validatePasswordStrength } from '../../utils/validation';
import { useFooterButtons } from './AccountSettings';
import { Loader } from '../ui/Loader';

// Password Requirements Tooltip component - extracted to reduce complexity
interface PasswordRequirementsTooltipProps {
  password: string;
  userFirstName: string;
  userLastName: string;
  userEmail: string;
  hasError: boolean;
  t: (key: string) => string;
}

const PasswordRequirementsTooltip: React.FC<PasswordRequirementsTooltipProps> = ({
  password,
  userFirstName,
  userLastName,
  userEmail,
  hasError,
  t
}) => {
  const validation = validatePasswordStrength(password, userFirstName, userLastName, userEmail);
  const hasPassword = password && password.trim().length > 0;

  return (
    <div className="relative group">
      <HelpCircle className={`w-4 h-4 ${hasError ? "text-red-400" : "text-gray-400"} cursor-help`} />
      <div className="invisible group-hover:visible group-focus-within:visible absolute left-0 mt-1 w-72 bg-card border rounded-xl shadow-lg p-4 text-sm z-50">
        <h4 className="font-medium mb-2 text-primary">{t('common:validation.passwordRequirements')}</h4>
        <ul className="space-y-1">
          <li className={`flex items-center ${validation.hasLength ? 'text-green-600' : 'text-red-500'}`}>
            • {t('common:validation.minLength')}
          </li>
          <li className={`flex items-center ${validation.hasUpper ? 'text-green-600' : 'text-red-500'}`}>
            • {t('common:validation.hasUpper')}
          </li>
          <li className={`flex items-center ${validation.hasLower ? 'text-green-600' : 'text-red-500'}`}>
            • {t('common:validation.hasLower')}
          </li>
          <li className={`flex items-center ${validation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
            • {t('common:validation.hasNumber')}
          </li>
          <li className={`flex items-center ${validation.hasSymbol ? 'text-green-600' : 'text-red-500'}`}>
            • {t('common:validation.hasSymbol')}
          </li>
          <li className={`flex items-center ${hasPassword && validation.containsNameAndEmail ? 'text-green-600' : 'text-red-500'}`}>
            • {t('common:validation.noNameEmail')}
          </li>
          <li className={`flex items-center ${hasPassword && validation.containsCommon ? 'text-green-600' : 'text-red-500'}`}>
            • {t('common:validation.noCommonWords')}
          </li>
        </ul>
      </div>
    </div>
  );
};

// Login Sessions component - extracted to reduce cognitive complexity
interface LoginSessionsProps {
  sessionsLoading: boolean;
  loginSessions: LoginSession[];
  currentSession: LoginSession | null;
  pastSessions: LoginSession[];
  formatDate: (dateString: string) => string;
  t: (key: string) => string;
}

const LoginSessions: React.FC<LoginSessionsProps> = ({
  sessionsLoading,
  loginSessions,
  currentSession,
  pastSessions,
  formatDate,
  t
}) => {
  if (sessionsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader size={10} textColor="text-gray-400" />
      </div>
    );
  }

  if (loginSessions.length === 0) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">{t('common:messages.noPreviousSessions')}</p>
    );
  }

  return (
    <div className="space-y-0">
      <div className="relative">
        {currentSession && (
          <div className="relative flex items-center pb-4">
            <div className="flex flex-col items-center mr-4 flex-shrink-0">
              {pastSessions.length > 0 && (
                <div className="w-0.5 h-full bg-gray-300 mt-2" style={{ borderStyle: 'dotted' }}></div>
              )}
            </div>
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              <div className={`w-4 h-4 border-2 rounded-sm ${'border-[var(--color-brand-600)]'}`}>
                <div className={`w-full h-1 border-b-2 ${'border-[var(--color-brand-600)]'} mt-0.5`}></div>
              </div>
              <span className="text-sm font-medium text-[var(--color-brand-600)]">
                {currentSession.browser}{currentSession.browser_version ? ` ${currentSession.browser_version}` : ''} on {currentSession.os}
              </span>
              <Monitor className="w-4 h-4 text-[var(--color-brand-600)]" />
              <span className="text-sm text-[var(--color-brand-600)]">{t('common:messages.desktop')}</span>
              <Clock className="w-4 h-4 text-[var(--color-brand-600)]" />
              <span className="text-sm text-[var(--color-brand-600)]">{formatDate(currentSession.login_at)}</span>
              {currentSession.timezone && (
                <>
                  <Earth className="w-4 h-4 text-[var(--color-brand-600)]" />
                  <span className="text-sm text-[var(--color-brand-600)]">{currentSession.timezone}</span>
                </>
              )}
            </div>
          </div>
        )}
        {pastSessions.map((session, index) => (
          <div key={`${session.login_at}-${index}`} className="relative flex items-center pb-4">
            <div className="flex flex-col items-center mr-4 flex-shrink-0">
              <div className="w-3 h-3 bg-gray-300 rounded-full z-10"></div>
              {index < pastSessions.length - 1 && (
                <div className="w-0.5 h-full bg-gray-300 mt-2" style={{ borderStyle: 'dotted' }}></div>
              )}
            </div>
            <div className="flex-1 flex items-center gap-2 flex-wrap">
              <div className="w-4 h-4 border-2 rounded-sm">
                <div className="w-full h-1 border-b-2 border mt-0.5"></div>
              </div>
              <span className="text-sm font-medium text-gray-600">
                {session.browser}{session.browser_version ? ` ${session.browser_version}` : ''} on {session.os}
              </span>
              <Monitor className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{t('common:messages.desktop')}</span>
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{formatDate(session.login_at)}</span>
              {session.timezone && (
                <>
                  <Earth className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{session.timezone}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SecuritySection: React.FC = () => {
  const { t } = useTranslation(['common', 'security']);
  const { user: authUser } = useAuth();
  const userId = authUser?.id;
  const toast = useToast();

  const {
    data: profileResponse,
    isLoading,
    error
  } = useUserProfile(userId || '');

  const [loginSessions, setLoginSessions] = React.useState<LoginSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = React.useState(true);

  // Password change states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Password validation states
  const [currentPasswordError, setCurrentPasswordError] = useState<string | null>(null);
  const [newPasswordError, setNewPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  // API hooks
  const changePasswordMutation = useChangePassword(userId || '');

  // Footer buttons context
  const { registerFooter, clearFooter, currentSection } = useFooterButtons();

  const userProfile = (profileResponse as any)?.data;

  // Get user data for password validation
  const userFirstName = userProfile?.first_name || authUser?.first_name || '';
  const userLastName = userProfile?.last_name || authUser?.last_name || '';
  const userEmail = userProfile?.email || authUser?.email || '';

  // Helper function to clear error for a specific field
  const clearFieldError = (field: string) => {
    if (field === 'currentPassword' && currentPasswordError) {
      setCurrentPasswordError(null);
    } else if (field === 'newPassword' && newPasswordError) {
      setNewPasswordError(null);
    } else if (field === 'confirmPassword' && confirmPasswordError) {
      setConfirmPasswordError(null);
    }
  };

  // Helper function to validate new password
  const validateNewPassword = (value: string) => {
    if (!value) {
      setNewPasswordError(null);
      return;
    }
    const validation = validatePasswordStrength(value, userFirstName, userLastName, userEmail);
    if (validation.isValid) {
      setNewPasswordError(null);
    } else {
      setNewPasswordError(validation.errorMessage || t('common:errors.passwordRequirements'));
    }
  };

  // Helper function to validate confirm password
  const validateConfirmPassword = (value: string) => {
    if (!value || value === passwordData.newPassword) {
      setConfirmPasswordError(null);
    } else {
      setConfirmPasswordError(t('common:errors.passwordMismatch'));
    }
  };

  // Password handling functions
  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear errors when user starts typing
    clearFieldError(field);

    // Real-time validation
    if (field === 'newPassword') {
      validateNewPassword(value);
    } else if (field === 'confirmPassword') {
      validateConfirmPassword(value);
    }
  };

  const handleUpdatePassword = useCallback(async () => {
    // Reset errors
    setCurrentPasswordError(null);
    setNewPasswordError(null);
    setConfirmPasswordError(null);

    // Validate current password
    if (!passwordData.currentPassword.trim()) {
      setCurrentPasswordError(t('security:changePassword.currentPasswordRequired'));
      return;
    }

    // Validate new password
    if (!passwordData.newPassword.trim()) {
      setNewPasswordError(t('security:changePassword.newPasswordRequired'));
      return;
    }

    const passwordValidation = validatePasswordStrength(
      passwordData.newPassword,
      userFirstName,
      userLastName,
      userEmail
    );
    if (!passwordValidation.isValid) {
      setNewPasswordError(passwordValidation.errorMessage || t('common:errors.passwordRequirements'));
      return;
    }

    // Validate confirm password
    if (!passwordData.confirmPassword.trim()) {
      setConfirmPasswordError(t('security:changePassword.confirmRequired'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setConfirmPasswordError(t('common:errors.passwordMismatch'));
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await changePasswordMutation.mutateAsync({
        old_password: passwordData.currentPassword,
        new_password: passwordData.newPassword
      });

      toast.success(t('common:toast.passwordUpdated'), { title: t('common:messages.success') });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      // Clear all errors
      setCurrentPasswordError(null);
      setNewPasswordError(null);
      setConfirmPasswordError(null);
    } catch (error: any) {
      console.error('Failed to update password:', error);
      toast.error(error?.message || t('common:errors.passwordUpdateFailed'), { title: t('common:messages.error') });
    } finally {
      setIsUpdatingPassword(false);
    }
  }, [passwordData, userFirstName, userLastName, userEmail, changePasswordMutation, toast]);

  // Load login sessions from activity_data
  useEffect(() => {
    const loadSessions = async () => {
      if (!userId) return;
      try {
        setSessionsLoading(true);
        const activityData = await getUserActivity(userId);
        if (activityData?.login_sessions) {
          // Sort by login_at descending (newest first)
          const sorted = [...activityData.login_sessions].sort(
            (a, b) => new Date(b.login_at).getTime() - new Date(a.login_at).getTime()
          );
          setLoginSessions(sorted);
        }
      } catch (error) {
        console.error('Failed to load login sessions:', error);
      } finally {
        setSessionsLoading(false);
      }
    };
    if (userId) loadSessions();
  }, [userId]);

  // Get current session (most recent)
  const currentSession = useMemo(() => {
    return loginSessions[0] || null;
  }, [loginSessions]);

  const pastSessions = useMemo(() => {
    return loginSessions.slice(1, 5); // Show last 4 past sessions
  }, [loginSessions]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('common:messages.justNow');
    if (diffMins < 60) return t('common:messages.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('common:messages.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('common:messages.daysAgo', { count: diffDays });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if form is valid for password update
  const isPasswordFormValid = useMemo(() => {
    return (
      passwordData.currentPassword &&
      passwordData.newPassword &&
      passwordData.confirmPassword &&
      passwordData.newPassword === passwordData.confirmPassword &&
      validatePasswordStrength(passwordData.newPassword, userFirstName, userLastName, userEmail).isValid &&
      currentPasswordError === null &&
      newPasswordError === null &&
      confirmPasswordError === null
    );
  }, [passwordData, userFirstName, userLastName, userEmail, currentPasswordError, newPasswordError, confirmPasswordError]);

  // Register footer buttons with cleanup
  useEffect(() => {
    // Only register if this is still the active section
    if (currentSection !== 'security') {
      return;
    }

    const footerContent = (
      <div className="flex items-center justify-end gap-3 w-full">
        <button
          onClick={() => {
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setCurrentPasswordError(null);
            setNewPasswordError(null);
            setConfirmPasswordError(null);
          }}
          disabled={isUpdatingPassword || changePasswordMutation.isPending}
          className="flex items-center gap-2 px-16 py-2 text-sm border text-gray-700 rounded-xl hover:bg-gray-50 font-medium disabled:opacity-50 transition-colors"
        >
          {t('common:buttons.cancel')}
        </button>
        <button
          onClick={handleUpdatePassword}
          disabled={
            isUpdatingPassword ||
            changePasswordMutation.isPending ||
            !isPasswordFormValid
          }
          className={`flex items-center gap-2 px-16 py-2 text-sm rounded-xl transition-colors ${isPasswordFormValid && !isUpdatingPassword && !changePasswordMutation.isPending
            ? 'btn-primary text-primary'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {(isUpdatingPassword || changePasswordMutation.isPending) && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {(isUpdatingPassword || changePasswordMutation.isPending) ? t('security:changePassword.updating') : t('security:changePassword.updateButton')}
        </button>
      </div>
    );
    registerFooter(footerContent, 'security');

    // Cleanup: clear footer when component unmounts or section changes
    return () => {
      if (currentSection === 'security') {
        clearFooter('security');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdatingPassword, changePasswordMutation.isPending, isPasswordFormValid, currentSection]);

  // Early returns for loading and error states
  if (isLoading) return (
    <div className="flex items-center justify-center py-12">
      <Loader text={t('common:messages.loadingSecurity')} textColor="text-gray-600" size={10} />
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="text-red-600 mb-2">{t('common:messages.failedToLoadSecurity')}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Change Password Section */}
      <div className="border-b pb-6">
        <h3 className="text-xl font-semibold text-primary mb-6">{t('common:messages.changePassword')}</h3>

        <div className="space-y-6">
          {/* Current Password */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {t('common:labels.currentPassword')}
            </label>
            <div className={`relative flex items-center ${currentPasswordError ? "border-red-500" : ""}`}>
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                onBlur={() => {
                  if (passwordData.currentPassword.trim()) {
                    setCurrentPasswordError(null);
                  } else {
                    setCurrentPasswordError(t('security:changePassword.currentPasswordRequired'));
                  }
                }}
                className={`w-full px-4 py-3 pr-20 border rounded-xl text-primary focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] focus:border-transparent transition-colors bg-card ${currentPasswordError ? "border-red-500 bg-red-50" : ""}`}
                placeholder={t('common:placeholders.enterCurrentPassword')}
                autoComplete="off"
                data-form-type="other"
              />
              <div className="absolute right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label={showCurrentPassword ? t('common:accessibility.hidePassword') : t('common:accessibility.showPassword')}
                >
                  {showCurrentPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            {currentPasswordError && <div className="mt-1.5 text-red-500 text-sm">{currentPasswordError}</div>}
          </div>

          {/* New Password and Confirm Password Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('common:labels.newPassword')}
              </label>
              <div className={`relative flex items-center ${newPasswordError ? "border-red-500" : ""}`}>
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  onBlur={() => {
                    if (passwordData.newPassword.trim()) {
                      const validation = validatePasswordStrength(
                        passwordData.newPassword,
                        userFirstName,
                        userLastName,
                        userEmail
                      );
                      if (validation.isValid) {
                        setNewPasswordError(null);
                      } else {
                        setNewPasswordError(validation.errorMessage || t('common:errors.passwordRequirements'));
                      }
                    } else {
                      setNewPasswordError(t('security:changePassword.newPasswordRequired'));
                    }
                  }}
                  className={`w-full px-4 py-3 pr-20 border text-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] focus:border-transparent transition-colors bg-card ${newPasswordError ? "border-red-500 bg-red-50" : ""}`}
                  placeholder={t('common:placeholders.enterNewPassword')}
                  autoComplete="new-password"
                />
                <div className="absolute right-3 flex items-center gap-2">
                  <PasswordRequirementsTooltip
                    password={passwordData.newPassword}
                    userFirstName={userFirstName}
                    userLastName={userLastName}
                    userEmail={userEmail}
                    hasError={!!newPasswordError}
                    t={t}
                  />
                  <button
                    type="button"
                    aria-label={showNewPassword ? t('common:accessibility.hidePassword') : t('common:accessibility.showPassword')}
                    onClick={() => setShowNewPassword(prev => !prev)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              {newPasswordError && <div className="mt-1.5 text-red-500 text-sm">{newPasswordError}</div>}
            </div>

            <div>
              <label htmlFor='confirm-new-password' className="block text-sm font-medium text-gray-700 mb-2">
                {t('common:labels.confirmNewPassword')}
              </label>
              <div className={`relative flex items-center ${confirmPasswordError ? "border-red-500" : ""}`}>
                <input
                  id="confirm-new-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  onBlur={() => {
                    if (passwordData.confirmPassword.trim() === '') {
                      setConfirmPasswordError(t('security:changePassword.confirmRequired'));
                    } else if (passwordData.confirmPassword === passwordData.newPassword) {
                      setConfirmPasswordError(null);
                    } else {
                      setConfirmPasswordError(t('common:errors.passwordMismatch'));
                    }
                  }}
                  className={`w-full px-4 py-3 pr-12 border text-primary rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] focus:border-transparent transition-colors bg-card ${confirmPasswordError ? "border-red-500 bg-red-50" : ""}`}
                  placeholder={t('common:placeholders.confirmNewPassword')}
                  autoComplete="new-password"
                />
                <div className="absolute right-3">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                    aria-label={showConfirmPassword ? t('common:accessibility.hidePassword') : t('common:accessibility.showPassword')}
                  >
                    {showConfirmPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {confirmPasswordError && <div className="mt-1.5 text-red-500 text-sm">{confirmPasswordError}</div>}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Login Activity */}
      <div>
        <h3 className="text-xl font-semibold text-primary mb-6">{t('common:messages.recentActivity')}</h3>
        <LoginSessions
          sessionsLoading={sessionsLoading}
          loginSessions={loginSessions}
          currentSession={currentSession}
          pastSessions={pastSessions}
          formatDate={formatDate}
          t={t}
        />
      </div>
    </div>
  );
};