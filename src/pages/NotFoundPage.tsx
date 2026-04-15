// Copyright (c) 2026 Aptlogica Technologies Private Limited
// SPDX-License-Identifier: MIT
// Websites: https://www.aptlogica.com | https://www.serenibase.com
// Support: support@aptlogica.com | support@serenibase.com
import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation('common');
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-3xl text-center">
        <div className="flex justify-center">
          <img
            src="/assets/page-not-found.png"
            alt={t('footer.pageNotFound')}
            className="w-[360px] max-w-full"
          />
        </div>
        <h1 className="mt-6 text-4xl font-semibold text-primary">{t('footer.pageNotFound')}</h1>
        <p className="mt-3 text-base text-secondary">
          {t('footer.sorryPageNotFound')}
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            to="/workspace"
            className="inline-flex items-center gap-2 rounded-xl px-6 py-3 bg-primary text-primary text-sm font-semibold shadow-sm hover:opacity-90 transition"
          >
            <Home className="h-4 w-4" />
            {t('footer.takeMeHome')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage; 
