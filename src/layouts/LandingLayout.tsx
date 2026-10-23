import { useState, useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X, Mail, Globe } from 'lucide-react'

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.085-2.047 2.064 2.064 0 112.085 2.047zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
import { Logo } from '@/components/shared/Logo'
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher'
import { Button } from '@/components/ui/button'
import { APP_NAME, APP_TAGLINE } from '@/constants/app'
import { useTranslation } from '@/contexts/LanguageContext'
import { cn } from '@/utils/cn'
import type { TranslationKey } from '@/i18n'

const NAV_LINKS: { key: TranslationKey; href: string }[] = [
  { key: 'landing.about', href: '#about' },
  { key: 'landing.services', href: '#services' },
  { key: 'landing.projects', href: '#projects' },
  { key: 'landing.pricing', href: '#pricing' },
  { key: 'landing.faq', href: '#faq' },
  { key: 'landing.contact', href: '#contact' },
]

export function LandingLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.hash, location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const overHero = !scrolled && !mobileOpen

  return (
    <div className="scheme-light flex min-h-screen flex-col bg-background text-foreground">
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full transition-all duration-300',
          overHero
            ? 'bg-transparent'
            : 'border-b border-border/80 bg-white/80 shadow-soft backdrop-blur-xl'
        )}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
          <Logo size="md" inverted={overHero} />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-xl px-3.5 py-2 text-sm font-medium transition-colors',
                  overHero
                    ? 'text-white/85 hover:bg-white/10 hover:text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
              >
                {t(link.key)}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LanguageSwitcher
              variant="button"
              className={cn(
                'rounded-xl',
                overHero &&
                  'border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white'
              )}
            />
            <Button
              variant="ghost"
              asChild
              className={cn(
                'rounded-xl',
                overHero
                  ? 'text-white hover:bg-white/10 hover:text-white'
                  : 'text-slate-700 hover:bg-slate-100'
              )}
            >
              <Link to="/auth/login">{t('landing.login')}</Link>
            </Button>
            <Button asChild className="rounded-2xl">
              <Link to="/auth/register">{t('landing.getStarted')}</Link>
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <LanguageSwitcher
              className={cn(overHero && 'text-white hover:bg-white/10 hover:text-white')}
            />
            <button
              type="button"
              className={cn(
                'inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors',
                overHero ? 'text-white hover:bg-white/10' : 'text-slate-900 hover:bg-slate-100'
              )}
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div
          id="mobile-nav"
          className={cn(
            'border-t border-border bg-white/95 backdrop-blur-xl lg:hidden',
            mobileOpen ? 'block' : 'hidden'
          )}
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4 sm:px-6" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-900 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                {t(link.key)}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="outline" asChild className="w-full">
                <Link to="/auth/login">{t('landing.login')}</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/auth/register">{t('landing.getStarted')}</Link>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="relative overflow-hidden bg-[#060913] text-slate-300">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_100%_0%,rgba(14,165,233,0.2),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 grid-pattern opacity-20" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Logo inverted size="md" />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
                {APP_TAGLINE}. Trusted by construction companies across Somaliland, East Africa, and
                globally.
              </p>
              <div className="mt-6 flex gap-3">
                {[
                  { href: '#contact', label: 'Email', icon: Mail },
                  { href: 'https://linkedin.com', label: 'LinkedIn', icon: LinkedInIcon },
                  { href: 'https://sitemaster.com', label: 'Website', icon: Globe },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-slate-300 transition hover:bg-sky-500 hover:text-white"
                    aria-label={item.label}
                  >
                    <item.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
              {[
                {
                  title: 'Product',
                  links: [
                    { label: t('landing.services'), href: '#services' },
                    { label: t('landing.pricing'), href: '#pricing' },
                    { label: t('landing.faq'), href: '#faq' },
                  ],
                },
                {
                  title: 'Company',
                  links: [
                    { label: t('landing.about'), href: '#about' },
                    { label: t('landing.projects'), href: '#projects' },
                    { label: t('landing.contact'), href: '#contact' },
                  ],
                },
                {
                  title: 'Access',
                  links: [
                    { label: t('landing.getStarted'), href: '/auth/register' },
                    { label: t('landing.login'), href: '/auth/login' },
                  ],
                },
              ].map((group) => (
                <div key={group.title}>
                  <h4 className="font-display text-sm font-semibold text-white">{group.title}</h4>
                  <ul className="mt-4 space-y-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        {link.href.startsWith('/') ? (
                          <Link
                            to={link.href}
                            className="text-sm text-slate-400 transition hover:text-sky-300"
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            href={link.href}
                            className="text-sm text-slate-400 transition hover:text-sky-300"
                          >
                            {link.label}
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <p className="text-xs text-slate-500">Somaliland · East Africa · Global</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
