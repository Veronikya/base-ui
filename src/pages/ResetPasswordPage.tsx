// Copyright (c) 2026 Aptlogica Technologies Private Limited
// SPDX-License-Identifier: MIT
// Websites: https://www.aptlogica.com | https://www.serenibase.com
// Support: support@aptlogica.com | support@serenibase.com
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, CheckCircle, Info, HelpCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { resetPassword } from "../service/clientService";
import { validatePasswordStrength } from "../utils/validation";

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation(['auth', 'common', 'fields']);
  const { token: tokenParam } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const tokenFromQuery = searchParams.get('token');
  // Support both path parameter (:token) and query parameter (?token=...)
  const token = tokenParam || tokenFromQuery;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  const handleSubmit = async (e:React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setPasswordError(null);
    setConfirmPasswordError(null);

    const trimmedPassword = formData.password.trim();
    if (trimmedPassword.length === 0) {
      setPasswordError(t('auth:validation.passwordRequiredField'));
      return;
    }

    const trimmedConfirmPassword = formData.confirmPassword.trim();
    if (trimmedConfirmPassword.length === 0) {
      setConfirmPasswordError(t('auth:validation.passwordRequiredField'));
      return;
    }

    // Use validatePasswordStrength (no user data available for reset password)
    const passwordValidation = validatePasswordStrength(formData.password, '', '', '');
    if (passwordValidation.isValid === false) {
      setPasswordError(passwordValidation.errorMessage || t('common:errors.passwordRequirements'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError(t('common:errors.passwordMismatch'));
      return;
    }

    if (!token) {
      setError(t('common:errors.invalidResetToken'));
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ 
        token: token, 
        new_password: formData.password 
      });
      setIsSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : t('common:errors.failedToResetPassword');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg border w-full bg-card rounded-2xl shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('auth:resetPassword.successTitle')}</h1>
          <p className="text-gray-600 mb-6">
            {t('common:toast.passwordResetSuccess')}
          </p>
          <Link
            to="/login"
            className="w-full btn-primary py-2 rounded-md transition inline-block text-center"
          >
            {t('common:buttons.signIn')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-lg border w-full bg-card rounded-2xl shadow-md p-8">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 transition mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('auth:resetPassword.backToLogin')}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth:resetPassword.title')}</h1>
          <p className="text-gray-600">
            {t('auth:resetPassword.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="reset-password-new" className="field-component-label">
              {t('fields:password.new')}{' '}
              <span className="field-component-required">*</span>
            </label>
            <div className="relative">
              <input
                id="reset-password-new"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, password: e.target.value }));
                  if (passwordError) setPasswordError(null);
                  if (error) setError("");
                }}
                onBlur={() => {
                  const trimmedPassword = formData.password.trim();
                  if (trimmedPassword.length === 0) {
                    setPasswordError(t('auth:validation.passwordRequiredField'));
                  } else {
                    const validation = validatePasswordStrength(formData.password, '', '', '');
                    if (validation.isValid === false) {
                      setPasswordError(validation.errorMessage || t('common:errors.passwordRequirements'));
                    } else {
                      setPasswordError(null);
                    }
                  }
                }}
                placeholder={t('auth:resetPassword.newPasswordPlaceholder')}
                className={`field-component field-component-border field-component-focus placeholder-[var(--color-text-placeholder)] ${passwordError ? "border-destructive bg-red-50" : ""} shadow-[var(--shadow-xs)]`}
                style={{ boxShadow: "var(--shadow-xs)" }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(prev => !prev)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <div className="relative group">
                  <HelpCircle className={`w-4 h-4 ${passwordError ? "text-red-400" : "text-gray-400"} cursor-help`} />
                  <div className="invisible group-hover:visible group-focus-within:visible absolute left-0 mt-1 w-72 bg-card border rounded-xl shadow-lg p-4 text-sm z-50">
                    <h4 className="font-medium mb-2 text-primary">{t('auth:resetPassword.passwordRequirementsTitle')}</h4>
                    <ul className="space-y-1">
                      {(() => {
                        const validation = validatePasswordStrength(formData.password, '', '', '');
                        const hasPassword = formData.password && formData.password.trim().length > 0;
                        return (
                          <>
                            <li className={`flex items-center ${validation.hasLength ? 'text-green-600' : 'text-red-500'}`}>
                              • {t('auth:resetPassword.minLength')}
                            </li>
                            <li className={`flex items-center ${validation.hasUpper ? 'text-green-600' : 'text-red-500'}`}>
                              • {t('auth:resetPassword.hasUpper')}
                            </li>
                            <li className={`flex items-center ${validation.hasLower ? 'text-green-600' : 'text-red-500'}`}>
                              • {t('auth:resetPassword.hasLower')}
                            </li>
                            <li className={`flex items-center ${validation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                              • {t('auth:resetPassword.hasNumber')}
                            </li>
                            <li className={`flex items-center ${validation.hasSymbol ? 'text-green-600' : 'text-red-500'}`}>
                              • {t('auth:resetPassword.hasSymbol')}
                            </li>
                            <li className={`flex items-center ${hasPassword && validation.containsNameAndEmail ? 'text-green-600' : 'text-red-500'}`}>
                              • {t('auth:resetPassword.noNameEmail')}
                            </li>
                            <li className={`flex items-center ${hasPassword && validation.containsCommon ? 'text-green-600' : 'text-red-500'}`}>
                              • {t('auth:resetPassword.noCommonWords')}
                            </li>
                          </>
                        );
                      })()}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            {formData.password && (() => {
              const validation = validatePasswordStrength(formData.password, '', '', '');
              return (
                <div className="mt-2 px-1.5 flex gap-1">
                  <div className={`h-0.5 flex-1 rounded transition-colors duration-200 ${validation.strength >= 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-0.5 flex-1 rounded transition-colors duration-200 ${validation.strength >= 3 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-0.5 flex-1 rounded transition-colors duration-200 ${validation.strength >= 5 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
                  <div className={`h-0.5 flex-1 rounded transition-colors duration-200 ${validation.strength === 7 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                </div>
              );
            })()}
            {passwordError && <div className="mt-1.5 text-red-500 text-sm">{passwordError}</div>}
          </div>

          <div className="relative">
            <label htmlFor="reset-password-confirm" className="field-component-label">
              {t('fields:password.confirm')}{' '}
              <span className="field-component-required">*</span>
            </label>
            <div className="relative">
              <input
                id="reset-password-confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
                  if (confirmPasswordError) setConfirmPasswordError(null);
                  if (error) setError("");
                }}
                onBlur={() => {
                  const trimmedConfirm = formData.confirmPassword.trim();
                  if (trimmedConfirm.length === 0) {
                    setConfirmPasswordError(t('auth:validation.passwordRequiredField'));
                  } else {
                    const passwordsMatch = formData.password === formData.confirmPassword;
                    if (passwordsMatch === false) {
                      setConfirmPasswordError(t('common:errors.passwordMismatch'));
                    } else {
                      setConfirmPasswordError(null);
                    }
                  }
                }}
                placeholder={t('auth:resetPassword.confirmPasswordPlaceholder')}
                className={`field-component field-component-border field-component-focus placeholder-[var(--color-text-placeholder)] ${confirmPasswordError ? "border-destructive bg-red-50" : ""} shadow-[var(--shadow-xs)]`}
                style={{ boxShadow: "var(--shadow-xs)" }}
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 flex items-center gap-2">
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            {confirmPasswordError && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Info className="w-4 h-4 text-red-400" />
              </div>
            )}
            {confirmPasswordError && <div className="mt-1.5 text-red-500 text-sm">{confirmPasswordError}</div>}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={(() => {
              const trimmedPassword = formData.password.trim();
              const trimmedConfirm = formData.confirmPassword.trim();
              const passwordValidation = validatePasswordStrength(formData.password, '', '', '');
              return isLoading ||
                trimmedPassword.length === 0 ||
                trimmedConfirm.length === 0 ||
                formData.password !== formData.confirmPassword ||
                passwordValidation.isValid === false ||
                passwordError !== null ||
                confirmPasswordError !== null;
            })()}
            className="w-full btn-primary py-2 px-4 rounded-xl font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('common:messages.resetting') : t('auth:resetPassword.resetButton')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {t('auth:resetPassword.rememberPassword')}{" "}
            <Link to="/login" className="text-primary hover:underline">
              {t('auth:resetPassword.signInLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
