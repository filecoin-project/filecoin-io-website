// Shared header navigation for the homepage and inner pages.
import { NAV, type NavSection } from '@/data/nav'

export type { NavGroup, NavLink, NavSection } from '@/data/nav'
export { opensInNewTab } from '@/data/nav'

export const SITE_MENUS: NavSection[] = NAV.home
