// Copyright (c) 2026 Aptlogica Technologies Private Limited
// SPDX-License-Identifier: MIT
// Websites: https://www.aptlogica.com | https://www.serenibase.com
// Support: support@aptlogica.com | support@serenibase.com
import React from "react";
import { AuditUser } from './AuditUser';
import { useTranslation } from "react-i18next";

interface AuditLastModifiedByProps {
  placeholder?: string;
}

export const AuditLastModifiedBy: React.FC<AuditLastModifiedByProps> = ({
  placeholder,
}) => {
  const { t } = useTranslation(['fields']);
  const defaultPlaceholder = t('fields:placeholders.lastModifiedBy');
  return <AuditUser placeholder={placeholder ?? defaultPlaceholder} />;
};
