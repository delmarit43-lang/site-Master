import { createElement, type ReactElement } from 'react'
import { modules } from '@/constants/navigation'
import { ModulePage } from '@/modules/shared/ModulePage'

/** Factory map of moduleId -> page component for route registration */
export const modulePageMap = Object.fromEntries(
  modules.map((mod) => [
    mod.id,
    function GeneratedModulePage() {
      return createElement(ModulePage, { moduleId: mod.id })
    },
  ])
) as Record<string, () => ReactElement>
