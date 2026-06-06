// src/i18n/navigation.ts
// Exporte Link, useRouter, usePathname, redirect locale-aware
// Utilisé à la place de 'next/link' et 'next/navigation' dans les composants

import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
