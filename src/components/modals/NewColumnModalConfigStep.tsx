// Copyright (c) 2026 Aptlogica Technologies Private Limited
// SPDX-License-Identifier: MIT
// Websites: https://www.aptlogica.com | https://www.serenibase.com
// Support: support@aptlogica.com | support@serenibase.com
/* eslint-disable sonarjs/cognitive-complexity */
import React from 'react';
import {
  Plus, Square, Check, Star, Heart, ThumbsUp, ThumbsDown, Flag, Circle, CheckCircle, BadgeCheck, ShieldCheck, Award, Trophy, Medal, Zap, Sparkles, Crown, Gem, Diamond, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react';

import Dropdown from '../../plugins/GridViewPlugin/components/shared/DropDown/DropDown';
import { DateTime, Duration, JSONField, User, Currency, MultiLineText, Formula } from '../../components/common/Fields';
import AdvancedDropdown from '../../components/common/dropdown/AdvancedDropdown';
import {
  ratingColorOptions, precisionOptions,
  currencyOptions,
  currencyLocaleOptions,
  progressColorOptions,
  durationFormatOptions,
  dateFormatOptions,
  timeFormatOptions,
  timeZoneOptions,
} from '../../types/constants';
import { renderBasicConfigStep } from './NewColumnModalConfigStep.basic';
import { renderDateTimeConfigStep } from './NewColumnModalConfigStep.dateTime';
import { renderContactConfigStep } from './NewColumnModalConfigStep.contact';
import { renderRelationsConfigStep } from './NewColumnModalConfigStep.relations';

export { renderDescriptionToggle };

function renderDescriptionToggle({
  showDescription,
  setShowDescription,
  description,
  setDescription,
  buttonClassName = 'flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] mb-3 space-y-2',
  wrapperClassName = 'relative',
  clearButtonClassName = 'absolute right-2 top-2 text-gray-400 hover:text-red-500',
}: {
  showDescription: boolean;
  setShowDescription: (value: boolean | ((prev: boolean) => boolean)) => void;
  description: string;
  setDescription: (value: string) => void;
  buttonClassName?: string;
  wrapperClassName?: string;
  clearButtonClassName?: string;
}) {
  return (
    <div className={wrapperClassName}>
      <button
        type="button"
        className={buttonClassName}
        onClick={() => setShowDescription((v: boolean) => !v)}
      >
        <Plus className="w-5 h-5" />
        Add description
      </button>
      {showDescription && (
        <>
          <MultiLineText
            placeholder="Enter field description..."
            value={description}
            onChange={(value) => setDescription(value)}
            rows={4}
            isBorder={true}
          />
          {description && (
            <button
              type="button"
              className={clearButtonClassName}
              onClick={() => setDescription('')}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

const descriptionButtonClassName = 'flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2';
const descriptionWrapperClassName = 'relative';
const descriptionClearButtonClassName = 'absolute right-2 top-2 text-gray-400 hover:text-red-500';

function renderBooleanConfig({
  checkboxIcon,
  setCheckboxIcon,
  checkboxColor,
  setCheckboxColor,
  checkboxDefault,
  setCheckboxDefault,
  showIconDropdown,
  setShowIconDropdown,
  showColorDropdown,
  setShowColorDropdown,
  description,
  setDescription,
}: {
  checkboxIcon: string;
  setCheckboxIcon: (value: string) => void;
  checkboxColor: string;
  setCheckboxColor: (value: string) => void;
  checkboxDefault: boolean;
  setCheckboxDefault: (value: boolean) => void;
  showIconDropdown: boolean;
  setShowIconDropdown: (value: boolean | ((prev: boolean) => boolean)) => void;
  showColorDropdown: boolean;
  setShowColorDropdown: (value: boolean | ((prev: boolean) => boolean)) => void;
  description: string;
  setDescription: (value: string) => void;
}) {
  const iconOptions: { key: string; label: string; checkedIcon: any; uncheckedIcon: any }[] = [
    {
      key: 'check',
      label: 'Check',
      checkedIcon: (
        <div className="w-4 h-4 rounded flex items-center justify-center bg-green-500 border-green-500">
          <Check className="w-2.5 h-2.5 text-primary" />
        </div>
      ),
      uncheckedIcon: (
        <div className="w-4 h-4 rounded flex items-center justify-center">
          <Square className="w-4 h-4 text-gray-400" />
        </div>
      )
    },
    {
      key: 'circle',
      label: 'Circle',
      checkedIcon: (
        <div className="w-4 h-4 rounded-full flex items-center justify-center bg-green-500 border-green-500">
          <Check className="w-2.5 h-2.5 text-primary" />
        </div>
      ),
      uncheckedIcon: (
        <div className="w-4 h-4 rounded-full flex items-center justify-center">
          <Circle className="w-4 h-4 text-gray-400" />
        </div>
      )
    },
    {
      key: 'star',
      label: 'Star',
      checkedIcon: (
        <div className="w-4 h-4 rounded flex items-center justify-center bg-green-500 border-green-500">
          <Check className="w-2.5 h-2.5 text-primary" />
        </div>
      ),
      uncheckedIcon: (
        <div className="w-4 h-4 rounded flex items-center justify-center">
          <Square className="w-4 h-4 text-gray-400" />
        </div>
      )
    },
  ];

  const colorOptions = [
    { key: 'green', label: 'Green', color: 'green', icon: <Check className="w-4 h-4 text-green-600" /> },
    { key: 'red', label: 'Red', color: 'red', icon: <Square className="w-4 h-4 text-red-600" /> },
    { key: 'blue', label: 'Blue', color: 'blue', icon: <Circle className="w-4 h-4 text-blue-600" /> },
    { key: 'yellow', label: 'Yellow', color: 'yellow', icon: <Star className="w-4 h-4 text-yellow-500" /> },
    { key: 'purple', label: 'Purple', color: 'purple', icon: <Diamond className="w-4 h-4 text-purple-600" /> },
    { key: 'gray', label: 'Gray', color: 'gray', icon: <Square className="w-4 h-4 text-gray-400" /> },
  ];

  const selectedIconOption = iconOptions.find(opt => opt.key === checkboxIcon);
  const selectedColorOption = colorOptions.find(opt => opt.key === checkboxColor);

  return (
    <>
      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Icon</div>
        <div className="grid grid-cols-3 gap-2">
          {iconOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setCheckboxIcon(option.key)}
              className={`p-3 rounded-xl border-2 transition-all ${checkboxIcon === option.key
                  ? 'text-[var(--color-text-primary)] rounded-xl border-[var(--color-border-brand)]'
                  : 'text-[var(--color-text-primary)] border hover:bg-gray-50'
                }`}
            >
              <div className="flex flex-col items-center gap-2">
                {selectedIconOption?.key === option.key ? option.checkedIcon : option.uncheckedIcon}
                <span className="text-xs">{option.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Color</div>
        <div className="grid grid-cols-6 gap-2">
          {colorOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setCheckboxColor(option.key)}
              className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${checkboxColor === option.key
                  ? 'border-[var(--color-border-brand)]'
                  : 'border hover:bg-gray-50'
                }`}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Default value</div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="checkboxDefault"
            checked={checkboxDefault}
            onChange={(e) => setCheckboxDefault(e.target.checked)}
            className="checkbox-primary-brand"
          />
          <label htmlFor="checkboxDefault" className="text-sm text-[var(--color-text-secondary)]">
            Checked by default
          </label>
        </div>
      </div>

      {renderDescriptionToggle({
        showDescription,
        setShowDescription,
        description,
        setDescription,
        buttonClassName: descriptionButtonClassName,
        wrapperClassName: descriptionWrapperClassName,
        clearButtonClassName: descriptionClearButtonClassName,
      })}
    </>
  );
}

function addUniqueOption({
  newOption,
  selectOptions,
  color,
  getOptionColor,
  setSelectOptions,
  setColor,
  setNewOption,
  setOptionError,
}: any) {
  if (!newOption.trim()) return;
  const trimmed = newOption.trim();
  const exists = selectOptions.some((opt: any) => opt.option.toLowerCase() === trimmed.toLowerCase());
  if (exists) {
    setOptionError('Option already exists');
    return;
  }
  const optionColor = color && color !== '#cccccc' ? color : getOptionColor();
  setSelectOptions([
    ...selectOptions,
    { option: trimmed, color: optionColor }
  ]);
  setColor('');
  setNewOption('');
  setOptionError('');
}

function handleAddOnEnter(event: React.KeyboardEvent<HTMLInputElement>, onAdd: () => void) {
  if (event.key === 'Enter') {
    onAdd();
  }
}

function updateOptionColor(idx: number, value: string, selectOptions: any[], setSelectOptions: (options: any[]) => void) {
  const newOptions = [...selectOptions];
  newOptions[idx] = { ...newOptions[idx], color: value };
  setSelectOptions(newOptions);
}

function handleEditInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>, onCancel: () => void) {
  if (event.key === 'Enter') {
    event.currentTarget.blur();
    return;
  }
  if (event.key === 'Escape') {
    onCancel();
  }
}

function renderMultiSelectConfig({
  newOption,
  setNewOption,
  optionError,
  setOptionError,
  selectOptions,
  setSelectOptions,
  color,
  setColor,
  getOptionColor,
  multiDefault,
  setMultiDefault,
  editingOptionIndex,
  setEditingOptionIndex,
  editingOptionValue,
  setEditingOptionValue,
  editInputRef,
  showDescription,
  setShowDescription,
  description,
  setDescription,
}: any) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(event.target.value);
    if (optionError) setOptionError('');
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    handleAddOnEnter(event, () => addUniqueOption({
      newOption,
      selectOptions,
      color,
      getOptionColor,
      setSelectOptions,
      setColor,
      setNewOption,
      setOptionError,
    }));
  };

  const handleColorChange = (idx: number, value: string) => {
    updateOptionColor(idx, value, selectOptions, setSelectOptions);
  };

  const handleEditStart = (idx: number, option: string) => {
    setEditingOptionIndex(idx);
    setEditingOptionValue(option);
  };

  const handleEditCancel = () => {
    setEditingOptionIndex(null);
    setEditingOptionValue('');
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingOptionValue(event.target.value);
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (event.key === 'Enter') {
      const trimmed = editingOptionValue.trim();
      if (!trimmed) return;
      const newOptions = [...selectOptions];
      const otherOptions = newOptions.filter((_, i) => i !== idx);
      const exists = otherOptions.some((opt) => opt.option.toLowerCase() === trimmed.toLowerCase());
      if (exists) return;
      newOptions[idx] = { ...newOptions[idx], option: trimmed };
      setSelectOptions(newOptions);
      handleEditCancel();
    } else if (event.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleDeleteOption = (idx: number) => {
    const newOptions = selectOptions.filter((_: any, i: number) => i !== idx);
    setSelectOptions(newOptions);
    if (multiDefault.includes(selectOptions[idx]?.option)) {
      setMultiDefault(multiDefault.filter((v: string) => v !== selectOptions[idx]?.option));
    }
  };

  const handleToggleDefault = (option: string) => {
    if (multiDefault.includes(option)) {
      setMultiDefault(multiDefault.filter((v: string) => v !== option));
    } else {
      setMultiDefault([...multiDefault, option]);
    }
  };

  const handleAddOption = () => {
    addUniqueOption({
      newOption,
      selectOptions,
      color,
      getOptionColor,
      setSelectOptions,
      setColor,
      setNewOption,
      setOptionError,
    });
  };

  return (
    <>
      <div className="mb-3">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Options</div>
        <div className="space-y-2">
          {selectOptions.map((opt: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-6 h-6 flex-shrink-0 rounded border flex items-center justify-center"
                style={{ backgroundColor: opt.color }}
              >
                {editingOptionIndex === idx ? (
                  <div className="w-4 h-4 bg-white/30 rounded" />
                ) : (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              {editingOptionIndex === idx ? (
                <input
                  ref={editInputRef}
                  type="text"
                  className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-focus-ring)]"
                  value={editingOptionValue}
                  onChange={handleEditChange}
                  onKeyDown={(e) => handleEditKeyDown(e, idx)}
                  onBlur={handleEditCancel}
                  autoFocus
                />
              ) : (
                <span
                  className="flex-1 text-sm cursor-pointer hover:text-[var(--color-brand-800)]"
                  onClick={() => handleEditStart(idx, opt.option)}
                >
                  {opt.option}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleToggleDefault(opt.option)}
                className={`px-2 py-0.5 text-xs rounded border ${multiDefault.includes(opt.option)
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
              >
                {multiDefault.includes(opt.option) ? 'Default' : 'Set default'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOption(idx)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              className={`w-full px-3 py-2 pr-16 text-sm border rounded-xl focus:outline-none focus:ring-1 ${optionError ? 'border-red-500 focus:ring-red-500' : 'border-[var(--color-border)] focus:ring-[var(--color-focus-ring)]'
                }`}
              placeholder="Add an option"
              value={newOption}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            <button
              type="button"
              onClick={() => setColor('#cccccc')}
              className="absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:border-gray-400"
              style={{ backgroundColor: color || '#cccccc' }}
            >
              {!color && <ChevronDown className="w-3 h-3 text-gray-400" />}
            </button>
            <AdvancedDropdown
              options={colorOptions}
              value={color || '#cccccc'}
              onChange={(val) => setColor(val as string)}
              trigger={
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded flex items-center justify-center"
                >
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              }
            />
          </div>
          <button
            type="button"
            className="px-3 py-1 btn-add-option text-sm"
            onClick={handleAddOption}
          >
            Add
          </button>
        </div>
        {optionError && <p className="mt-1 text-xs text-red-500">{optionError}</p>}
      </div>

      {renderDescriptionToggle({
        showDescription,
        setShowDescription,
        description,
        setDescription,
        buttonClassName: descriptionButtonClassName,
        wrapperClassName: descriptionWrapperClassName,
        clearButtonClassName: descriptionClearButtonClassName,
      })}
    </>
  );
}

const colorOptions = [
  { key: '#3b82f6', label: 'Blue', color: '#3b82f6' },
  { key: '#ef4444', label: 'Red', color: '#ef4444' },
  { key: '#22c55e', label: 'Green', color: '#22c55e' },
  { key: '#eab308', label: 'Yellow', color: '#eab308' },
  { key: '#a855f7', label: 'Purple', color: '#a855f7' },
  { key: '#ec4899', label: 'Pink', color: '#ec4899' },
  { key: '#f97316', label: 'Orange', color: '#f97316' },
  { key: '#06b6d4', label: 'Cyan', color: '#06b6d4' },
  { key: '#6b7280', label: 'Gray', color: '#6b7280' },
  { key: '#000000', label: 'Black', color: '#000000' },
];

function renderSelectConfig({
  newOption,
  setNewOption,
  optionError,
  setOptionError,
  selectOptions,
  setSelectOptions,
  color,
  setColor,
  getOptionColor,
  singleDefault,
  setSingleDefault,
  editingOptionIndex,
  setEditingOptionIndex,
  editingOptionValue,
  setEditingOptionValue,
  editInputRef,
  showDescription,
  setShowDescription,
  description,
  setDescription,
}: any) {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewOption(event.target.value);
    if (optionError) setOptionError('');
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    handleAddOnEnter(event, () => addUniqueOption({
      newOption,
      selectOptions,
      color,
      getOptionColor,
      setSelectOptions,
      setColor,
      setNewOption,
      setOptionError,
    }));
  };

  const handleColorChange = (idx: number, value: string) => {
    updateOptionColor(idx, value, selectOptions, setSelectOptions);
  };

  const handleEditStart = (idx: number, option: string) => {
    setEditingOptionIndex(idx);
    setEditingOptionValue(option);
  };

  const handleEditCancel = () => {
    setEditingOptionIndex(null);
    setEditingOptionValue('');
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditingOptionValue(event.target.value);
  };

  const handleEditKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (event.key === 'Enter') {
      const trimmed = editingOptionValue.trim();
      if (!trimmed) return;
      const newOptions = [...selectOptions];
      const otherOptions = newOptions.filter((_, i) => i !== idx);
      const exists = otherOptions.some((opt) => opt.option.toLowerCase() === trimmed.toLowerCase());
      if (exists) return;
      newOptions[idx] = { ...newOptions[idx], option: trimmed };
      setSelectOptions(newOptions);
      handleEditCancel();
    } else if (event.key === 'Escape') {
      handleEditCancel();
    }
  };

  const handleDeleteOption = (idx: number) => {
    const newOptions = selectOptions.filter((_: any, i: number) => i !== idx);
    setSelectOptions(newOptions);
    if (singleDefault === selectOptions[idx]?.option) {
      setSingleDefault('');
    }
  };

  const handleAddOption = () => {
    addUniqueOption({
      newOption,
      selectOptions,
      color,
      getOptionColor,
      setSelectOptions,
      setColor,
      setNewOption,
      setOptionError,
    });
  };

  return (
    <>
      <div className="mb-3">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Options</div>
        <div className="space-y-2">
          {selectOptions.map((opt: any, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <div
                className="w-6 h-6 flex-shrink-0 rounded border flex items-center justify-center"
                style={{ backgroundColor: opt.color }}
              >
                {singleDefault === opt.option && <Check className="w-3 h-3 text-white" />}
              </div>
              {editingOptionIndex === idx ? (
                <input
                  ref={editInputRef}
                  type="text"
                  className="flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-focus-ring)]"
                  value={editingOptionValue}
                  onChange={handleEditChange}
                  onKeyDown={(e) => handleEditKeyDown(e, idx)}
                  onBlur={handleEditCancel}
                  autoFocus
                />
              ) : (
                <span
                  className="flex-1 text-sm cursor-pointer hover:text-[var(--color-brand-800)]"
                  onClick={() => handleEditStart(idx, opt.option)}
                >
                  {opt.option}
                </span>
              )}
              <button
                type="button"
                onClick={() => setSingleDefault(singleDefault === opt.option ? '' : opt.option)}
                className={`px-2 py-0.5 text-xs rounded border ${singleDefault === opt.option
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400'
                  }`}
              >
                {singleDefault === opt.option ? 'Default' : 'Set default'}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOption(idx)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              className={`w-full px-3 py-2 pr-16 text-sm border rounded-xl focus:outline-none focus:ring-1 ${optionError ? 'border-red-500 focus:ring-red-500' : 'border-[var(--color-border)] focus:ring-[var(--color-focus-ring)]'
                }`}
              placeholder="Add an option"
              value={newOption}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
            />
            <button
              type="button"
              onClick={() => setColor('#cccccc')}
              className="absolute right-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:border-gray-400"
              style={{ backgroundColor: color || '#cccccc' }}
            >
              {!color && <ChevronDown className="w-3 h-3 text-gray-400" />}
            </button>
            <AdvancedDropdown
              options={colorOptions}
              value={color || '#cccccc'}
              onChange={(val) => setColor(val as string)}
              trigger={
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded flex items-center justify-center"
                >
                  <ChevronDown className="w-3 h-3 text-gray-400" />
                </button>
              }
            />
          </div>
          <button
            type="button"
            className="px-3 py-1 btn-add-option text-sm"
            onClick={handleAddOption}
          >
            Add
          </button>
        </div>
        {optionError && <p className="mt-1 text-xs text-red-500">{optionError}</p>}
      </div>

      {renderDescriptionToggle({
        showDescription,
        setShowDescription,
        description,
        setDescription,
        buttonClassName: descriptionButtonClassName,
        wrapperClassName: descriptionWrapperClassName,
        clearButtonClassName: descriptionClearButtonClassName,
      })}
    </>
  );
}

function renderRatingConfig({
  ratingIcon,
  setRatingIcon,
  showRatingIconDropdown,
  setShowRatingIconDropdown,
  ratingColor,
  setRatingColor,
  showRatingColorDropdown,
  setShowRatingColorDropdown,
  ratingMax,
  setRatingMax,
  ratingDefault,
  setRatingDefault,
  showRatingDefault,
  setShowRatingDefault,
  ratingDefaultHover,
  setRatingDefaultHover,
  showDescription,
  setShowDescription,
  description,
  setDescription,
}: any) {
  const ratingIconOptions = [
    { key: 'star', label: 'Star', icon: <Star className="w-4 h-4" /> },
    { key: 'heart', label: 'Heart', icon: <Heart className="w-4 h-4" /> },
    { key: 'circle', label: 'Circle', icon: <Circle className="w-4 h-4" /> },
    { key: 'thumb', label: 'Thumb', icon: <ThumbsUp className="w-4 h-4" /> },
    { key: 'flag', label: 'Flag', icon: <Flag className="w-4 h-4" /> },
    { key: 'check', label: 'Check', icon: <CheckCircle className="w-4 h-4" /> },
  ];

  const ratingColorOptions2 = [
    { key: 'yellow', label: 'Yellow', color: '#eab308', icon: <Star className="w-4 h-4 text-yellow-500" /> },
    { key: 'red', label: 'Red', color: '#ef4444', icon: <Heart className="w-4 h-4 text-red-500" /> },
    { key: 'blue', label: 'Blue', color: '#3b82f6', icon: <ThumbsUp className="w-4 h-4 text-blue-500" /> },
    { key: 'green', label: 'Green', color: '#22c55e', icon: <CheckCircle className="w-4 h-4 text-green-500" /> },
    { key: 'purple', label: 'Purple', color: '#a855f7', icon: <Flag className="w-4 h-4 text-purple-500" /> },
    { key: 'orange', label: 'Orange', color: '#f97316', icon: <Circle className="w-4 h-4 text-orange-500" /> },
  ];

  const selectedIconOption = ratingIconOptions.find(opt => opt.key === ratingIcon);
  const selectedColorOption = ratingColorOptions2.find(opt => opt.key === ratingColor);

  return (
    <>
      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Icon</div>
        <div className="grid grid-cols-6 gap-2">
          {ratingIconOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setRatingIcon(option.key)}
              className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${ratingIcon === option.key
                  ? 'border-[var(--color-border-brand)] bg-[var(--color-gray-100)]'
                  : 'border hover:bg-gray-50'
                }`}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Color</div>
        <div className="grid grid-cols-6 gap-2">
          {ratingColorOptions2.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setRatingColor(option.key)}
              className={`p-2 rounded-xl border-2 transition-all flex items-center justify-center ${ratingColor === option.key
                  ? 'border-[var(--color-border-brand)] bg-[var(--color-gray-100)]'
                  : 'border hover:bg-gray-50'
                }`}
            >
              {option.icon}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Max rating</div>
        <AdvancedDropdown
          options={[
            { value: '3', label: '3' },
            { value: '5', label: '5' },
            { value: '10', label: '10' },
          ]}
          value={ratingMax}
          onChange={(val) => setRatingMax(val as string)}
        />
      </div>

      <div className="mb-4">
        <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Default value</div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ratingShowDefault"
            checked={showRatingDefault}
            onChange={(e) => setShowRatingDefault(e.target.checked)}
            className="checkbox-primary-brand"
          />
          <label htmlFor="ratingShowDefault" className="text-sm text-[var(--color-text-secondary)]">
            Set a default rating
          </label>
        </div>
        {showRatingDefault && (
          <div className="mt-2">
            <AdvancedDropdown
              options={Array.from({ length: Number(ratingMax) }, (_, i) => ({
                value: String(i + 1),
                label: String(i + 1),
              }))}
              value={ratingDefault}
              onChange={(val) => setRatingDefault(val as string)}
              placeholder="Select default rating"
            />
          </div>
        )}
      </div>

      {renderDescriptionToggle({
        showDescription,
        setShowDescription,
        description,
        setDescription,
        buttonClassName: descriptionButtonClassName,
        wrapperClassName: descriptionWrapperClassName,
        clearButtonClassName: descriptionClearButtonClassName,
      })}
    </>
  );
}

export function renderNewColumnConfigStep(props: any) {
  const {
    selectedType,
    defaultValue,
    setDefaultValue,
    description,
    setDescription,
    richText,
    setRichText,
    showThousands,
    setShowThousands,
    precision,
    setPrecision,
    checkboxIcon,
    setCheckboxIcon,
    checkboxColor,
    setCheckboxColor,
    checkboxDefault,
    setCheckboxDefault,
    selectOptions,
    setSelectOptions,
    color,
    setColor,
    newOption,
    setNewOption,
    multiDefault,
    setMultiDefault,
    singleDefault,
    setSingleDefault,
    editingOptionIndex,
    setEditingOptionIndex,
    editingOptionValue,
    setEditingOptionValue,
    optionError,
    setOptionError,
    dateFormat,
    setDateFormat,
    dateDefault,
    setDateDefault,
    showDateDefault,
    setShowDateDefault,
    yearDefault,
    setYearDefault,
    showYearDefault,
    setShowYearDefault,
    timeFormat,
    setTimeFormat,
    timeDefault,
    setTimeDefault,
    showTimeDefault,
    setShowTimeDefault,
    hourFormat,
    setHourFormat,
    displayTimeZone,
    setDisplayTimeZone,
    sameTimezone,
    setSameTimezone,
    timeZone,
    setTimeZone,
    dateTimeDefault,
    setDateTimeDefault,
    showDateTimeDefault,
    setShowDateTimeDefault,
    phoneValid,
    setPhoneValid,
    phoneDefault,
    setPhoneDefault,
    showPhoneDefault,
    setShowPhoneDefault,
    emailValid,
    setEmailValid,
    emailDefault,
    setEmailDefault,
    showEmailDefault,
    setShowEmailDefault,
    urlValid,
    setUrlValid,
    urlDefault,
    setUrlDefault,
    showUrlDefault,
    setShowUrlDefault,
    displayAsProgress,
    setDisplayAsProgress,
    progressColor,
    setProgressColor,
    showPercentDefault,
    setShowPercentDefault,
    percentDefault,
    setPercentDefault,
    durationFormat,
    setDurationFormat,
    showDurationDefault,
    setShowDurationDefault,
    durationDefault,
    setDurationDefault,
    currencyType,
    setCurrencyType,
    currencyLocale,
    setCurrencyLocale,
    showCurrencyDefault,
    setShowCurrencyDefault,
    currencyDefault,
    setCurrencyDefault,
    ratingIcon,
    setRatingIcon,
    ratingColor,
    setRatingColor,
    ratingMax,
    setRatingMax,
    ratingDefault,
    setRatingDefault,
    showRatingDefault,
    setShowRatingDefault,
    ratingDefaultHover,
    setRatingDefaultHover,
    allowMultipleUsers,
    setAllowMultipleUsers,
    showUserDefault,
    setShowUserDefault,
    selectedUsers,
    setSelectedUsers,
    relationType,
    setRelationType,
    selectedTableId,
    setSelectedTableId,
    selectedTable,
    setSelectedTable,
    selectedRelationId,
    setSelectedRelationId,
    selectedLookupColumnId,
    setSelectedLookupColumnId,
    setHasUserModifiedLookupColumn,
    formulaText,
    setFormulaText,
    formulaFormatting,
    showJsonDefault,
    setShowJsonDefault,
    showTextDefault,
    setShowTextDefault,
    showDescription,
    setShowDescription,
    showIconDropdown,
    setShowIconDropdown,
    showColorDropdown,
    setShowColorDropdown,
    showRatingIconDropdown,
    setShowRatingIconDropdown,
    showRatingColorDropdown,
    setShowRatingColorDropdown,
    fields,
    tables,
    linkFields,
    targetTableFields,
    isTargetTableLoading,
    getOptionColor,
    editInputRef,
    handleLongtextModalOpen,
    handleLongtextModalClose,
    setFormulaError,
    isValidPercentInput,
    isLinksFieldEditing,
  } = props;
  const handleJsonChange = (value: any) => {
    const stringify = JSON.stringify(value, null, 2);
    setDefaultValue(stringify);
  };

  // Handle precision change - components will handle their own formatting
  const handlePrecisionChange = (newPrecision: string | number) => {
    setPrecision(newPrecision);
  };

  // Prevent duplicate React keys in dropdown options when constants contain repeated values.
  const getUniqueDropdownOptions = (options: Array<{ label?: string; value?: string }>) => {
    const seen = new Set<string>();
    return options.reduce<Array<{ label: string; value: string }>>((acc, option) => {
      const label = option?.label ?? option?.value ?? '';
      const value = option?.value ?? option?.label ?? '';
      if (!label || !value) return acc;
      if (seen.has(value)) return acc;
      seen.add(value);
      acc.push({ label, value });
      return acc;
    }, []);
  };

  const uniqueCurrencyLocaleOptions = getUniqueDropdownOptions(currencyLocaleOptions);
  const uniqueCurrencyOptions = getUniqueDropdownOptions(currencyOptions);
  const currencySymbolByType: Record<string, string> = {
    USD: '$',
    EUR: '\u20AC',
    GBP: '\u00A3',
    JPY: '\u00A5',
    CAD: 'C$',
    AUD: 'A$',
    CHF: 'CHF',
    CNY: '\u00A5',
    INR: '\u20B9',
    BRL: 'R$',
  };

  function renderConfigStep() {
    const basicConfig = renderBasicConfigStep({
      selectedType,
      defaultValue,
      setDefaultValue,
      showTextDefault,
      setShowTextDefault,
      showDescription,
      setShowDescription,
      description,
      setDescription,
      richText,
      setRichText,
      showThousands,
      setShowThousands,
      precision,
      setPrecision,
      handleLongtextModalOpen,
      handleLongtextModalClose,
    });
    if (basicConfig) return basicConfig;
    const dateTimeConfig = renderDateTimeConfigStep({
      selectedType,
      dateFormat,
      setDateFormat,
      showDateDefault,
      setShowDateDefault,
      dateDefault,
      setDateDefault,
      showDescription,
      setShowDescription,
      description,
      setDescription,
      showYearDefault,
      setShowYearDefault,
      yearDefault,
      setYearDefault,
      hourFormat,
      setHourFormat,
      showTimeDefault,
      setShowTimeDefault,
      timeDefault,
      setTimeDefault,
    });
    if (dateTimeConfig) return dateTimeConfig;
    const contactConfig = renderContactConfigStep({
      selectedType,
      phoneValid,
      setPhoneValid,
      showPhoneDefault,
      setShowPhoneDefault,
      phoneDefault,
      setPhoneDefault,
      showDescription,
      setShowDescription,
      description,
      setDescription,
      emailValid,
      setEmailValid,
      showEmailDefault,
      setShowEmailDefault,
      emailDefault,
      setEmailDefault,
      urlValid,
      setUrlValid,
      showUrlDefault,
      setShowUrlDefault,
      urlDefault,
      setUrlDefault,
    });
    if (contactConfig) return contactConfig;
    const relationsConfig = renderRelationsConfigStep({
      selectedType,
      isLinksFieldEditing,
      relationType,
      setRelationType,
      tables,
      selectedTableId,
      setSelectedTableId,
      selectedTable,
      setSelectedTable,
      showDescription,
      setShowDescription,
      description,
      setDescription,
      linkFields,
      targetTableFields,
      selectedRelationId,
      setSelectedRelationId,
      selectedLookupColumnId,
      setSelectedLookupColumnId,
      setHasUserModifiedLookupColumn,
      isTargetTableLoading,
    });
    if (relationsConfig) return relationsConfig;

    switch (selectedType?.key) {
      case 'boolean':
        return renderBooleanConfig({
          checkboxIcon,
          setCheckboxIcon,
          checkboxColor,
          setCheckboxColor,
          checkboxDefault,
          setCheckboxDefault,
          showIconDropdown,
          setShowIconDropdown,
          showColorDropdown,
          setShowColorDropdown,
          description,
          setDescription,
        });
      case 'multiSelect':
        return renderMultiSelectConfig({
          newOption,
          setNewOption,
          optionError,
          setOptionError,
          selectOptions,
          setSelectOptions,
          color,
          setColor,
          getOptionColor,
          multiDefault,
          setMultiDefault,
          editingOptionIndex,
          setEditingOptionIndex,
          editingOptionValue,
          setEditingOptionValue,
          editInputRef,
          showDescription,
          setShowDescription,
          description,
          setDescription,
        });
      case 'select':
        return renderSelectConfig({
          newOption,
          setNewOption,
          optionError,
          setOptionError,
          selectOptions,
          setSelectOptions,
          color,
          setColor,
          getOptionColor,
          singleDefault,
          setSingleDefault,
          editingOptionIndex,
          setEditingOptionIndex,
          editingOptionValue,
          setEditingOptionValue,
          editInputRef,
          showDescription,
          setShowDescription,
          description,
          setDescription,
        });
      case 'percent':
        return (
          <>
            <div className="flex items-center gap-2 mb-3">
              <label className="relative inline-flex gap-3 items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="display-as-progress"
                  checked={displayAsProgress}
                  onChange={e => setDisplayAsProgress(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-[var(--color-focus-ring)] rounded-full peer peer-checked:bg-primary transition-colors" />
                <div className="absolute left-0.5 top-1 w-4 h-4 bg-card rounded-full shadow transform transition-transform peer-checked:translate-x-4" />
                <span className="text-sm font-medium text-[var(--color-text-tertiary)]">Display as progress bar</span>
              </label>
            </div>

            {displayAsProgress && (
              <>
                <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Progress color</div>
                <AdvancedDropdown
                  options={progressColorOptions}
                  value={progressColor}
                  onChange={(val: any) => setProgressColor(val as string)}
                  placeholder="Select progress color"
                />
              </>
            )}
            <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowPercentDefault((v: boolean) => !v)}>
              <Plus className="w-5 h-5" />
              Set default value
            </button>
            {showPercentDefault && (
              <input
                type="text"
                className="field-component field-component-border field-component-focus"
                placeholder="Enter default percentage"
                value={percentDefault?.toString() || ''}
                onChange={e => {
                  const value = e.target.value;
                  if (isValidPercentInput(value)) {
                    const numericValue = Number.parseFloat(value);
                    if (numericValue >= 0 && numericValue <= 100) {
                      setPercentDefault(numericValue);
                    }
                  }
                }}
              />
            )}
            <div className="relative">
              <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowDescription((v: boolean) => !v)}>
                <Plus className="w-5 h-5" />
                Add description
              </button>
              {showDescription && (
                <>
                  <MultiLineText
                    placeholder="Enter field description..."
                    value={description}
                    onChange={value => setDescription(value)}
                    rows={4}
                    isBorder={true}
                  />
                  {description &&
                    <button className="absolute right-2 top-2 text-gray-400 hover:text-red-500" onClick={() => setDescription('')}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  }
                </>
              )}
            </div>
          </>
        );
      case 'currency':
        return (
          <>
            <div className='flex gap-2 mb-2'>
              <div className='flex-1'>
                <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Locale</div>
                <AdvancedDropdown
                  options={uniqueCurrencyLocaleOptions}
                  value={currencyLocale}
                  onChange={(val) => setCurrencyLocale(val as string)}
                  placeholder="Select locale"
                  searchable={true}
                />
              </div>
              <div className='flex-1'>
                <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Currency</div>
                <AdvancedDropdown
                  options={uniqueCurrencyOptions}
                  value={currencyType}
                  onChange={(val) => setCurrencyType(val as string)}
                  placeholder="Select currency"
                  searchable={true}
                />
              </div>
            </div>
            <div className="mb-4 text-xs text-gray-600">
              Selected currency: {currencySymbolByType[currencyType] || currencyType}
            </div>
            <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Precision</div>
            <AdvancedDropdown
              options={precisionOptions}
              value={precision}
              onChange={(val) => handlePrecisionChange(val as string)}
              placeholder="Select precision"
              clearable
            />
            <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowCurrencyDefault((v: boolean)  => !v)}>
              <Plus className="w-5 h-5" />
              Set default value
            </button>
            {showCurrencyDefault && (
              <Currency
                value={currencyDefault}
                onChange={(value: any) => setCurrencyDefault(value)}
                config={{
                  currencyType: currencyType,
                  currencyLocale: currencyLocale,
                  precision: typeof precision === 'string' ? (precision.split('.')[1]?.length || 0) : precision,
                  defaultValue: currencyDefault === null || currencyDefault === undefined
                    ? ''
                    : currencyDefault.toString()
                }}
                isBorder={true}
              />
            )}
            <div className="relative">
              <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowDescription((v: boolean) => !v)}>
                <Plus className="w-5 h-5" />
                Add description
              </button>
              {showDescription && (
                <>
                  <MultiLineText
                    placeholder="Enter field description..."
                    value={description}
                    onChange={value => setDescription(value)}
                    rows={4}
                    isBorder={true}
                  />
                  {description &&
                    <button className="absolute right-2 top-2 text-gray-400 hover:text-red-500" onClick={() => setDescription('')}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  }
                </>
              )}
            </div>
          </>
        );
      case 'duration':
        return (
          <>
            <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Format</div>
            <AdvancedDropdown
              options={durationFormatOptions}
              value={durationFormat}
              onChange={(val) => setDurationFormat(val as string)}
            />

            <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowDurationDefault((v: boolean) => !v)}>
              <Plus className="w-5 h-5" />
              Set default value
            </button>

            {showDurationDefault && (
              <Duration
                value={durationDefault}
                onChange={(value) => setDurationDefault(value)}
                isBorder={true}
                config={{
                  durationFormat: durationFormat as "h:mm" | "h:mm:ss" | "h:mm:ss.s" | "h:mm:ss.ss" | "h:mm:ss.sss" | "d:h:mm" | undefined,
                }}
              />
            )}

            <div className="relative">
              <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowDescription((v: boolean) => !v)}>
                <Plus className="w-5 h-5" />
                Add description
              </button>
              {showDescription && (
                <>
                  <MultiLineText
                    placeholder="Enter field description..."
                    value={description}
                    onChange={value => setDescription(value)}
                    rows={4}
                    isBorder={true}
                  />
                  {description &&
                    <button className="absolute right-2 top-2 text-gray-400 hover:text-red-500" onClick={() => setDescription('')}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  }
                </>
              )}
            </div>
          </>
        );
      case 'rating':
        return renderRatingConfig({
          ratingIcon,
          setRatingIcon,
          showRatingIconDropdown,
          setShowRatingIconDropdown,
          ratingColor,
          setRatingColor,
          showRatingColorDropdown,
          setShowRatingColorDropdown,
          ratingMax,
          setRatingMax,
          ratingDefault,
          setRatingDefault,
          showRatingDefault,
          setShowRatingDefault,
          ratingDefaultHover,
          setRatingDefaultHover,
          showDescription,
          setShowDescription,
          description,
          setDescription,
        });
      case 'datetime':
      case 'createdTime':
      case 'lastModifiedTime':
        return (
          <>
            {/* Date Format */}
            <div className="mb-3">
              <div className="block text-sm font-medium text-[var(--color-text-tertiary)] mb-1">Date format</div>
              <AdvancedDropdown
                options={dateFormatOptions}
                value={dateFormat}
                onChange={(val) => setDateFormat(val as string)}
              />
            </div>
            {/* Time Format */}
            <div className="mb-3">
              <div className="block text-sm font-medium text-[var(--color-text-tertiary)] mb-1">Time format</div>
              <AdvancedDropdown
                options={timeFormatOptions}
                value={timeFormat}
                onChange={(val) => setTimeFormat(val as string)}
              />
            </div>
            {/* Time Zone */}
            <div className="mb-3">
              <div className="mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="displayTimeZone"
                    checked={displayTimeZone}
                    onChange={(e) => setDisplayTimeZone(e.target.checked)}
                    className="checkbox-primary-brand"
                  />
                  <label htmlFor="displayTimeZone" className="text-sm text-[var(--text-color-secondary)]">
                    Display timezone
                  </label>
                </div>
              </div>
              {displayTimeZone && (
                <>
                  <div className="mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="sameTimezone"
                        checked={sameTimezone}
                        onChange={(e) => setSameTimezone(e.target.checked)}
                        className="checkbox-primary-brand"
                      />
                      <label htmlFor="sameTimezone" className="text-sm text-[var(--text-color-secondary)]">
                        Same timezone for all values
                      </label>
                    </div>
                  </div>
                  {!sameTimezone && (
                    <AdvancedDropdown
                      options={timeZoneOptions}
                      value={timeZone}
                      onChange={(val) => setTimeZone(val as string)}
                      placeholder="Select timezone"
                      searchable
                    />
                  )}
                </>
              )}
            </div>
            {/* Set default */}
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showDateTimeDefault"
                  checked={showDateTimeDefault}
                  onChange={(e) => setShowDateTimeDefault(e.target.checked)}
                  className="checkbox-primary-brand"
                />
                <label htmlFor="showDateTimeDefault" className="text-sm text-[var(--text-color-secondary)]">
                  Set default value
                </label>
              </div>
              {showDateTimeDefault && (
                <div className="mt-2">
                  <DateTime
                    value={dateTimeDefault}
                    onChange={setDateTimeDefault}
                    dateFormat={dateFormat}
                    timeFormat={timeFormat}
                    isBorder={true}
                    config={{}}
                  />
                </div>
              )}
            </div>
            {renderDescriptionToggle({
              showDescription,
              setShowDescription,
              description,
              setDescription,
              buttonClassName: descriptionButtonClassName,
              wrapperClassName: descriptionWrapperClassName,
              clearButtonClassName: descriptionClearButtonClassName,
            })}
          </>
        );
      case 'user':
        return (
          <>
            <div className="mb-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowMultipleUsers"
                  checked={allowMultipleUsers}
                  onChange={(e) => setAllowMultipleUsers(e.target.checked)}
                  className="checkbox-primary-brand"
                />
                <label htmlFor="allowMultipleUsers" className="text-sm text-[var(--text-color-secondary)]">
                  Allow multiple users
                </label>
              </div>
            </div>
            <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowUserDefault((v: boolean) => !v)}>
              <Plus className="w-5 h-5" />
              Set default value
            </button>
            {showUserDefault && (
              <User
                value={selectedUsers}
                onChange={setSelectedUsers}
                config={{}}
                isBorder={true}
              />
            )}
            {renderDescriptionToggle({
              showDescription,
              setShowDescription,
              description,
              setDescription,
              buttonClassName: descriptionButtonClassName,
              wrapperClassName: descriptionWrapperClassName,
              clearButtonClassName: descriptionClearButtonClassName,
            })}
          </>
        );
      case 'formula':
        return (
          <>
            <div className="mb-3">
              <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Formula</div>
              <Formula
                value={formulaText}
                onChange={(value) => {
                  setFormulaText(value);
                  setFormulaError(null);
                }}
                fields={fields}
                config={{}}
                isBorder={true}
              />
              {formulaError && (
                <p className="mt-1 text-xs text-red-500">{formulaError}</p>
              )}
            </div>
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="formulaFormatting"
                  checked={formulaFormatting}
                  onChange={(e) => {
                    setDefaultValue(e.target.checked ? 'formatted' : 'unformatted');
                  }}
                  className="checkbox-primary-brand"
                />
                <label htmlFor="formulaFormatting" className="text-sm text-[var(--text-color-secondary)]">
                  Format result as number
                </label>
              </div>
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowDescription((v: boolean) => !v)}>
                <Plus className="w-5 h-5" />
                Add description
              </button>
              {showDescription && (
                <>
                  <MultiLineText
                    placeholder="Enter field description..."
                    value={description}
                    onChange={value => setDescription(value)}
                    rows={4}
                    isBorder={true}
                  />
                  {description &&
                    <button className="absolute right-2 top-2 text-gray-400 hover:text-red-500" onClick={() => setDescription('')}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  }
                </>
              )}
            </div>
          </>
        );
      case 'json':
        return (
          <>
            <div className="mb-3">
              <div className="mb-2 text-sm font-medium text-[var(--color-text-tertiary)]">Default value</div>
              <JSONField
                value={defaultValue ? JSON.parse(defaultValue) : {}}
                onChange={handleJsonChange}
                config={{}}
                isBorder={true}
              />
            </div>
            <div className="relative">
              <button className="flex items-center gap-2 text-primary-brand text-sm font-medium hover:text-[var(--color-brand-800)] my-3 space-y-2" onClick={() => setShowDescription((v: boolean) => !v)}>
                <Plus className="w-5 h-5" />
                Add description
              </button>
              {showDescription && (
                <>
                  <MultiLineText
                    placeholder="Enter field description..."
                    value={description}
                    onChange={value => setDescription(value)}
                    rows={4}
                    isBorder={true}
                  />
                  {description &&
                    <button className="absolute right-2 top-2 text-gray-400 hover:text-red-500" onClick={() => setDescription('')}>
                      <Trash2 className="w-5 h-5" />
                    </button>
                  }
                </>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-4">
      {renderConfigStep()}
    </div>
  );
}
