// Copyright (c) 2026 Aptlogica Technologies Private Limited
// SPDX-License-Identifier: MIT
// Websites: https://www.aptlogica.com | https://www.serenibase.com
// Support: support@aptlogica.com | support@serenibase.com
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../auth/AuthContext';
import { useCurrentUser } from '../../auth/useCurrentUser';
import { useUserProfile, useUpdateUserProfile, useRemoveAvatar } from '../../hooks/useApi';
import { UserProfile } from '../../types/userProfile';
import { useToast } from '../common/Toast';
import { Loader2, CheckCircle, CloudUpload, X } from 'lucide-react';
import { AdvancedDropdown } from '../common/dropdown/AdvancedDropdown';
import { timeZoneOptions, currencyLocaleOptions } from '../../types/constants';
import { useFooterButtons } from './AccountSettings';
import { DateField } from '../common/Fields/DateField';
import { validateDOB, getYesterdayISO, convertDateToFormat } from '../../utils/dateValidation';

type ProfileFormData = {
  first_name?: string;
  last_name?: string;
  display_name?: string;
  country?: string;
  dob?: string;
  timezone?: string;
  locale?: string;
};

const buildFormDataFromProfile = (userProfile: UserProfile): ProfileFormData => ({
  first_name: userProfile.first_name || '',
  last_name: userProfile.last_name || '',
  display_name: userProfile.display_name || '',
  country: userProfile.country || '',
  dob: userProfile.dob || '',
  locale: userProfile.locale || '',
  timezone: userProfile.timezone || '',
});

const safeSessionStorageSet = (key: string, value: string) => {
  try {
    if (typeof sessionStorage === 'undefined') return false;
    sessionStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const PROFILE_UPDATE_FIELDS: Array<keyof ProfileFormData> = [
  'first_name',
  'last_name',
  'display_name',
  'country',
  'dob',
  'timezone',
  'locale',
];

const buildProfileUpdatePayload = (formData: ProfileFormData): Record<string, string> => {
  const payload: Record<string, string> = {};

  for (const field of PROFILE_UPDATE_FIELDS) {
    const value = formData[field];
    payload[field] = value ?? '';
  }

  return payload;
};

const getSafeImageSrc = (value: string | null | undefined): string => {
  if (!value) return '';
  const trimmed = String(value).trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url.toString();
    }
    if (url.protocol === 'blob:') {
      if (typeof globalThis !== 'undefined' && globalThis.location?.origin) {
        if (url.origin !== globalThis.location.origin) return '';
      }
      return url.toString();
    }
  } catch {
    return '';
  }

  return '';
};


const getTimeZonesForCountry = (country?: string) => {
  if (!country) return [];
  return timeZoneOptions.filter(t => t.country === country);
};

const getAvatarUploadStateClass = (isEditing: boolean, isDragging: boolean): string => {
  if (!isEditing) return 'border bg-gray-50 cursor-not-allowed opacity-60';
  if (isDragging) return 'border-[var(--color-brand-600)] bg-[var(--color-brand-50)] cursor-pointer';
  return 'border hover:border-green-500 bg-gray-50 cursor-pointer';
};

const getTzDropdownPlaceholder = (isEditing: boolean, activeCountry: string, t: (key: string) => string): string => {
  if (!isEditing) return t('profile:placeholders.notSet');
  return activeCountry ? t('profile:placeholders.selectTimeZone') : t('common:messages.selectCountryFirst');
};

interface AvatarUploadAreaProps {
  isEditing: boolean;
  isDragging: boolean;
  updateProfileMutation: any;
  avatarUploadStateClass: string;
  avatarUploadBusyClass: string;
  onDragOver: (e: React.DragEvent<HTMLElement>) => void;
  onDrop: (e: React.DragEvent<HTMLElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  triggerAvatarInput: () => void;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
}

const AvatarUploadArea: React.FC<AvatarUploadAreaProps> = ({
  isEditing,
  updateProfileMutation,
  avatarUploadStateClass,
  avatarUploadBusyClass,
  onDragOver,
  onDrop,
  onDragLeave,
  triggerAvatarInput,
  handleAvatarUpload,
  isDragging,
  t,
}) => (
  <button
    onDragOver={isEditing ? onDragOver : undefined}
    onDrop={isEditing ? onDrop : undefined}
    onDragLeave={isEditing ? onDragLeave : undefined}
    className={`border-2 w-full border-dashed rounded-xl p-8 text-center transition-colors ${avatarUploadStateClass} ${avatarUploadBusyClass}`}
    onClick={isEditing ? triggerAvatarInput : undefined}
  >
    <input
      id="avatar-upload-input"
      type="file"
      accept="image/*"
      onChange={handleAvatarUpload}
      disabled={updateProfileMutation.isPending}
      className="hidden"
    />
    <CloudUpload className={`w-12 h-12 ${isDragging ? 'text-[var(--color-brand-600)]' : 'text-gray-400'} mx-auto mb-3`} />
    <p className="text-sm text-gray-600 mb-1">
      <span className="text-green-500 font-medium">{t('profile:upload.clickToUpload')}</span> {t('profile:upload.orDragAndDrop')}
    </p>
    <p className="text-xs text-gray-500">
      {t('profile:upload.imageConstraints')}
    </p>
  </button>
);

interface AvatarImageProps {
  displayAvatarUrl: string | null;
  updateProfileMutation: any;
  isEditing: boolean;
  selectedAvatarFile: File | null;
  removeAvatarMutation: any;
  onRemoveAvatar: () => Promise<void>;
  handleRemovePreview: () => void;
}

const AvatarImage: React.FC<AvatarImageProps> = ({
  displayAvatarUrl,
  updateProfileMutation,
  isEditing,
  selectedAvatarFile,
  removeAvatarMutation,
  onRemoveAvatar,
  handleRemovePreview,
}) => (
  <div className="relative flex-shrink-0">
    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center overflow-hidden">
      <img
        src={getSafeImageSrc(displayAvatarUrl)}
        alt="Profile"
        className="w-full h-full object-cover"
      />
      {updateProfileMutation.isPending && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        </div>
      )}
    </div>
    {isEditing && !updateProfileMutation.isPending && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedAvatarFile) {
            handleRemovePreview();
          } else {
            onRemoveAvatar();
          }
        }}
        disabled={removeAvatarMutation.isPending}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-primary rounded-full flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-50"
      >
        <X size={12} />
      </button>
    )}
  </div>
);

export const ProfileSection: React.FC = () => {
  const { t } = useTranslation(['common', 'profile']);
  const { user: authUser } = useAuth();
  const currentUser = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({});
  const isFormInitializedRef = useRef(false);
  const formDataRef = useRef<ProfileFormData>({}); // Ref to always get latest formData

  const [hasChanges, setHasChanges] = useState(false);
  const [dobError, setDobError] = useState<string | null>(null);

  // Toast for notifications
  const toast = useToast();

  // Footer buttons context
  const { registerFooter, clearFooter, currentSection } = useFooterButtons();

  // API hooks
  const updateProfileMutation = useUpdateUserProfile(authUser?.id || '');
  const removeAvatarMutation = useRemoveAvatar(authUser?.id || '');

  // Avatar states
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  // Get user ID from auth user
  const userId = authUser?.id;

  // Fetch user profile data
  const {
    data: profileResponse,
    isLoading,
    error,
    refetch
  } = useUserProfile(userId || '');

  const userProfile: UserProfile | null = (profileResponse as any)?.data || null;



  // Initialize form data ONLY when entering edit mode - never reset while editing
  useEffect(() => {
    // Only initialize when isEditing becomes true and form hasn't been initialized yet
    if (userProfile && isEditing && !isFormInitializedRef.current) {
      setFormData(buildFormDataFromProfile(userProfile));
      isFormInitializedRef.current = true;

      // Store timezone and country in sessionStorage when profile loads
      if (userProfile.timezone) {
        safeSessionStorageSet('timezone', userProfile.timezone);
      }
      if (userProfile.country) {
        safeSessionStorageSet('country', userProfile.country);
      }
    }

    // Reset flag when exiting edit mode
    if (!isEditing) {
      isFormInitializedRef.current = false;
    }
  }, [isEditing]); // ONLY depend on isEditing - never reset when userProfile changes

  // Keep ref in sync with formData state (safety net)
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Clean up preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  // Check for changes
  useEffect(() => {
    if (userProfile && isEditing) {
      const hasFormChanges =
        formData.first_name !== userProfile.first_name ||
        formData.last_name !== userProfile.last_name ||
        formData.display_name !== userProfile.display_name ||
        formData.country !== (userProfile.country || '') ||
        formData.dob !== (userProfile.dob || '') ||
        formData.locale !== (userProfile.locale || '') ||
        formData.timezone !== (userProfile.timezone || '') ||
        selectedAvatarFile !== null;
      setHasChanges(hasFormChanges);
    }
  }, [formData, userProfile, isEditing, selectedAvatarFile]);

  // Register footer buttons with cleanup
  useEffect(() => {
    // Only register if this is still the active section
    if (currentSection !== 'profile') {
      return;
    }

    const footerContent = isEditing ? (
      <div className="flex items-center justify-end gap-3 w-full">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 px-16 py-2 text-sm border text-gray-700 rounded-xl hover:bg-gray-50 font-medium disabled:opacity-50 transition-colors"
        >
          {t('common:buttons.cancel')}
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center gap-2 px-16 py-2 text-sm btn-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-primary"
        >
          {t('common:buttons.update')}
        </button>
      </div>
    ) : (
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={() => {
            if (userProfile) {
              setFormData(buildFormDataFromProfile(userProfile));
            }
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-16 py-2 text-sm btn-primary transition-colors rounded-xl text-primary"
        >
          {t('common:buttons.edit')}
        </button>
      </div>
    );
    registerFooter(footerContent, 'profile');

    // Cleanup: clear footer when component unmounts or section changes
    return () => {
      if (currentSection === 'profile') {
        clearFooter('profile');
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, hasChanges, registerFooter, clearFooter, currentSection]);

  const handleInputChange = (field: 'first_name' | 'last_name' | 'display_name' | 'country' | 'dob' | 'timezone' | 'locale', value: string) => {
    if (field === 'country') {
      const country = value;
      const tzEntries = getTimeZonesForCountry(country);
      const tzValues = tzEntries.map(t => t.value);
      setFormData(prev => {
        const prevTz = prev.timezone || '';
        const nextTz = tzValues.includes(prevTz) ? prevTz : (tzValues[0] || '');
        const newData = {
          ...prev,
          country,
          timezone: nextTz,
        };
        formDataRef.current = newData; // Update ref immediately
        return newData;
      });
      return;
    }
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      formDataRef.current = newData; // Update ref immediately
      return newData;
    });
  };

  const validateDobField = (dob: string): boolean => {
    if (!dob) return true;
    const dobErr = validateDOB(dob, 'DD-MM-YYYY');
    if (dobErr) {
      setDobError(dobErr);
      toast.error(dobErr, { title: t('common:errors.invalidDateOfBirth') });
      return false;
    }
    return true;
  };

  const cleanupAvatarPreview = () => {
    setSelectedAvatarFile(null);
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
      setAvatarPreviewUrl(null);
    }
  };

  const persistProfileSettings = (formData: ProfileFormData) => {
    if (formData.country) {
      safeSessionStorageSet('country', formData.country);
    }
    if (formData.timezone) {
      safeSessionStorageSet('timezone', formData.timezone);
    }
  };

  const resetProfileState = () => {
    setIsEditing(false);
    setHasChanges(false);
    setFormData({});
    formDataRef.current = {};
    setDobError(null);
    cleanupAvatarPreview();
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    const latestFormData = formDataRef.current;

    if (!validateDobField(latestFormData.dob || '')) {
      return;
    }

    try {
      const payload = buildProfileUpdatePayload(latestFormData);

      await updateProfileMutation.mutateAsync({
        ...payload,
        avatarFile: selectedAvatarFile || undefined,
      });

      persistProfileSettings(latestFormData);
      resetProfileState();
      toast.success(t('common:toast.profileUpdated'), { title: t('common:messages.success') });
    } catch (error: any) {
      toast.error(t('common:errors.profileSaveFailed'), { title: t('common:messages.error') });
    }
  };

  const handleCancel = () => {
    if (userProfile) {
      setFormData(buildFormDataFromProfile(userProfile));
    }
    setDobError(null);
    setIsEditing(false);
    setHasChanges(false);

    // Clear avatar selection and preview
    setSelectedAvatarFile(null);
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
      setAvatarPreviewUrl(null);
    }
  };


  // Avatar handling functions
  const processFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error(t('common:errors.invalidFileType'), { title: t('common:messages.error') });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('common:errors.fileTooLarge'), { title: t('common:messages.error') });
      return;
    }

    // Clean up previous preview URL if exists
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    // Create preview URL and store file
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(getSafeImageSrc(previewUrl) || null);
    setSelectedAvatarFile(file);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveAvatar = async () => {
    try {
      await removeAvatarMutation.mutateAsync();
      toast.success(t('common:toast.avatarRemoved'), { title: t('common:messages.success') });
    } catch (error: any) {
      toast.error(t('common:errors.avatarRemoveFailed'), { title: t('common:messages.error') });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">{t('profile:messages.loading')}</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-red-600 mb-2">{t('profile:messages.failedToLoad')}</div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-primary rounded-md hover:bg-blue-700"
          >
            {t('common:buttons.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  // No profile data
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-600 mb-2">{t('profile:messages.noDataAvailable')}</div>
        </div>
      </div>
    );
  }

  const displayAvatarUrl = avatarPreviewUrl || userProfile?.avatar || currentUser?.avatar;
  const avatarUploadStateClass = getAvatarUploadStateClass(isEditing, isDragging);
  const avatarUploadBusyClass = (updateProfileMutation.isPending) ? 'opacity-50 cursor-not-allowed' : '';

  const activeCountry = isEditing ? (formData.country || '') : (userProfile.country || '');
  const tzDropdownOptions = getTimeZonesForCountry(activeCountry)
    .map((t) => ({ label: `${t.label} (${t.value})`, value: t.value }));
  const tzDropdownValue = isEditing ? (formData.timezone || '') : (userProfile.timezone || '');
  const tzDropdownPlaceholder = getTzDropdownPlaceholder(isEditing, activeCountry, t);

  const triggerAvatarInput = () => {
    if (!isEditing || updateProfileMutation.isPending) return;
    document.getElementById('avatar-upload-input')?.click();
  };



  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div className="space-y-6">
        {/* First Name and Last Name - Side by Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span>{t('profile:form.firstName')}</span>
              <input
                type="text"
                value={isEditing ? (formData.first_name || '') : (userProfile.first_name || '')}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                disabled={isEditing === false}
                className="w-full px-4 py-3 border rounded-xl bg-alpha-white focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder={t('profile:placeholders.enterFirstName')}
              />
            </label>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span>{t('profile:form.lastName')}</span>
              <input
                type="text"
                value={isEditing ? (formData.last_name || '') : (userProfile.last_name || '')}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                disabled={isEditing === false}
                className="w-full px-4 py-3 border rounded-xl bg-alpha-white focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                placeholder={t('profile:placeholders.enterLastName')}
              />
            </label>
          </div>
        </div>

        {/* Display Name - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <span>{t('profile:form.displayName')}</span>
            <input
              type="text"
              value={isEditing ? (formData.display_name || '') : (userProfile.display_name || '')}
              onChange={(e) => handleInputChange('display_name', e.target.value)}
              disabled={isEditing === false}
              className="w-full px-4 py-3 border rounded-xl bg-alpha-white focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder={t('profile:placeholders.enterDisplayName')}
            />
          </label>
        </div>

        {/* Email Address */}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            {t('profile:form.emailAddress')}
          </div>
          <div className="px-4 py-3 bg-gray-50 border rounded-xl text-gray-500 flex items-center justify-between gap-2 disabled:cursor-not-allowed">
            <span>{userProfile.email}</span>
            {userProfile.email_verified && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                <CheckCircle className="w-3 h-3" />
                {t('common:messages.verified')}
              </span>
            )}
          </div>
        </div>

        {/* Profile Image */}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            {t('common:labels.profileImage')}
          </div>
          {displayAvatarUrl ? (
            <div className="flex gap-4">
              {/* Image Preview - Left Side */}
              <AvatarImage
                displayAvatarUrl={displayAvatarUrl}
                updateProfileMutation={updateProfileMutation}
                isEditing={isEditing}
                selectedAvatarFile={selectedAvatarFile}
                removeAvatarMutation={removeAvatarMutation}
                onRemoveAvatar={handleRemoveAvatar}
                handleRemovePreview={() => {
                  setSelectedAvatarFile(null);
                  if (avatarPreviewUrl) {
                    URL.revokeObjectURL(avatarPreviewUrl);
                    setAvatarPreviewUrl(null);
                  }
                }}
              />

              {/* Upload Area - Right Side */}
              <div className="flex-1">
                <AvatarUploadArea
                  isEditing={isEditing}
                  isDragging={isDragging}
                  updateProfileMutation={updateProfileMutation}
                  avatarUploadStateClass={avatarUploadStateClass}
                  avatarUploadBusyClass={avatarUploadBusyClass}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onDragLeave={handleDragLeave}
                  triggerAvatarInput={triggerAvatarInput}
                  handleAvatarUpload={handleAvatarUpload}
                  t={t}
                />
              </div>
            </div>
          ) : (
            <AvatarUploadArea
              isEditing={isEditing}
              isDragging={isDragging}
              updateProfileMutation={updateProfileMutation}
              avatarUploadStateClass={avatarUploadStateClass}
              avatarUploadBusyClass={avatarUploadBusyClass}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragLeave={handleDragLeave}
              triggerAvatarInput={triggerAvatarInput}
              handleAvatarUpload={handleAvatarUpload}
              t={t}
            />
          )}
        </div>

        {/* Country */}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            {t('profile:form.country')}
          </div>
          <AdvancedDropdown
            options={Array.from(new Set(timeZoneOptions.map(t => t.country)))
              .sort((a: string, b: string) => a.localeCompare(b))
              .map((country) => ({ label: country, value: country }))}
            value={isEditing ? (formData.country || '') : (userProfile.country || '')}
            onChange={(val) => handleInputChange('country', (val as string) || '')}
            placeholder={t('profile:placeholders.selectCountry')}
            searchable
            clearable
            disabled={!isEditing}
            className=""
          />
        </div>

        {/* Time Zone */}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            {t('profile:form.timeZone')}
          </div>
          <AdvancedDropdown
            options={tzDropdownOptions}
            value={tzDropdownValue}
            onChange={(val) => handleInputChange('timezone', (val as string) || '')}
            placeholder={tzDropdownPlaceholder}
            searchable
            clearable
            disabled={!isEditing}
            className=""
          />
        </div>

        {/* Language */}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            {t('profile:form.language')}
          </div>
          <AdvancedDropdown
            options={currencyLocaleOptions}
            value={isEditing ? (formData.locale || '') : (userProfile.locale || '')}
            onChange={(val) => handleInputChange('locale', (val as string) || '')}
            placeholder={t('profile:placeholders.selectLanguage')}
            searchable
            clearable
            disabled={!isEditing}
            className=""
          />
        </div>

        {/* Date of Birth */}
        <div>
          <div className="block text-sm font-medium text-gray-700 mb-2">
            {t('profile:form.dateOfBirth')}
          </div>
          {isEditing ? (
            <>
              <DateField
                value={formData.dob || ''}
                onChange={(val) => {
                  handleInputChange('dob', val);
                  if (dobError) setDobError(null);
                }}
                format="DD-MM-YYYY"
                isBorder
                max={convertDateToFormat(getYesterdayISO(), 'DD-MM-YYYY')}
                config={{
                  max: convertDateToFormat(getYesterdayISO(), 'DD-MM-YYYY'),
                  hideTodayButton: true
                }}
                disabled={!isEditing}
              />
              {dobError && <div className="mt-1.5 text-red-500 text-sm">{dobError}</div>}
            </>
          ) : (
            <input
              type="text"
              value={userProfile.dob || ''}
              disabled
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--color-brand-600)] focus:border-transparent transition-colors disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              placeholder={t('profile:placeholders.notSet')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
