import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { CommandPalette } from '@/components/shared/CommandPalette'
import { SidebarProvider } from '@/contexts/SidebarContext'
import { cn } from '@/utils/cn'
import { useSidebar } from '@/contexts/SidebarContext'

function DashboardShell() {
  const [commandOpen, setCommandOpen] = useState(false)
  const { collapsed } = useSidebar()

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex min-h-screen flex-1 flex-col transition-all',
          collapsed ? 'lg:ml-0' : 'lg:ml-0'
        )}
      >
        <Header onOpenCommand={() => setCommandOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  )
}

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <DashboardShell />
    </SidebarProvider>
  )
}
