import { Link } from 'react-router-dom'
import { Layers } from 'lucide-react'
import { Section, SectionHeader } from '@/components/landing/Section'
import { EmptyState } from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'

export function LatestProjectsSection() {
  return (
    <Section id="latest">
      <SectionHeader
        eyebrow="Latest"
        title="Recent project updates"
        description="Published project highlights and release notes will land here. Until then, spin up a workspace and explore with your own data."
      />

      <div className="mt-12">
        <EmptyState
          icon={<Layers className="h-7 w-7" />}
          title="No public updates yet"
          description="When new project stories and platform milestones are ready, they’ll show up in this feed. Ready to try SiteMaster yourself?"
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link to="/auth/register">Create an account</Link>
        </Button>
        <Button variant="outline" asChild>
          <a href="#contact">Talk to us</a>
        </Button>
      </div>
    </Section>
  )
}
