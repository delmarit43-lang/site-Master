import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, PanelLeftClose, PanelLeft } from 'lucide-react'
import { Logo } from '@/components/shared/Logo'
import { sidebarNav } from '@/constants/navigation'
import { useSidebar } from '@/contexts/SidebarContext'
import { useTranslation } from '@/contexts/LanguageContext'
import { navTitleKeys } from '@/i18n/navKeys'
import { getIcon } from '@/utils/icons'
import { cn } from '@/utils/cn'
import type { NavItem } from '@/types'
import { ScrollArea } from '@/components/ui/scroll-area'

function useNavLabel() {
  const { t } = useTranslation()
  return (title: string) => {
    const key = navTitleKeys[title]
    return key ? t(key) : title
  }
}

function NavGroup({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const location = useLocation()
  const label = useNavLabel()
  const hasChildren = Boolean(item.children?.length)
  const isChildActive = item.children?.some((c) => location.pathname.startsWith(c.href ?? ''))
  const [open, setOpen] = useState(Boolean(isChildActive))
  const Icon = getIcon(item.icon)
  const title = label(item.title)

  if (!hasChildren && item.href) {
    return (
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          cn(
            'flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all',
            isActive
              ? 'bg-primary text-white shadow-soft'
              : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white',
            collapsed && 'justify-center px-2'
          )
        }
        title={collapsed ? title : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && <span>{title}</span>}
      </NavLink>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-colors',
          isChildActive
            ? 'bg-sidebar-accent text-white'
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-white',
          collapsed && 'justify-center px-2'
        )}
        title={collapsed ? title : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" />
        {!collapsed && (
          <>
            <span className="flex-1 text-start">{title}</span>
            <ChevronDown
              className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
            />
          </>
        )}
      </button>
      {!collapsed && open && item.children && (
        <div className="ms-4 mt-1 space-y-0.5 border-s border-sidebar-border ps-3">
          {item.children.map((child) => {
            const ChildIcon = getIcon(child.icon)
            const childTitle = label(child.title)
            return (
              <NavLink
                key={child.href}
                to={child.href!}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary/20 font-medium text-primary'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white'
                  )
                }
              >
                <ChildIcon className="h-4 w-4 shrink-0" />
                <span>{childTitle}</span>
              </NavLink>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const { collapsed, mobileOpen, setMobileOpen, toggleCollapsed } = useSidebar()

  const sidebarContent = (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        <Logo inverted showWordmark={!collapsed} to="/dashboard" />
        <button
          type="button"
          onClick={toggleCollapsed}
          className="hidden rounded-2xl p-2 text-sidebar-foreground/70 transition hover:bg-sidebar-accent hover:text-white lg:inline-flex"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {sidebarNav.map((item) => (
            <NavGroup key={item.title} item={item} collapsed={collapsed} />
          ))}
        </nav>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-4">
        {!collapsed && (
          <p className="text-xs text-sidebar-foreground/50">
            SiteMaster Enterprise CMS
          </p>
        )}
      </div>
    </div>
  )

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-navy/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 start-0 z-50 w-72 border-e border-sidebar-border transition-transform duration-300 lg:static lg:translate-x-0',
          collapsed && 'lg:w-[72px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0 lg:rtl:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
