import { Link } from 'react-router-dom'
import { cn } from '@/utils/cn'
import { APP_NAME } from '@/constants/app'

interface LogoProps {
  className?: string
  showWordmark?: boolean
  size?: 'sm' | 'md' | 'lg'
  to?: string
  inverted?: boolean
}

const sizeMap = {
  sm: { mark: 30, text: 'text-base' },
  md: { mark: 38, text: 'text-xl' },
  lg: { mark: 50, text: 'text-2xl' },
}

export function LogoMark({
  size = 38,
  inverted = false,
  className,
}: {
  size?: number
  inverted?: boolean
  className?: string
}) {
  const bgGradient = inverted ? 'url(#logoGradientInverted)' : 'url(#logoGradient)'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('shrink-0 transition-transform duration-300 hover:scale-105', className)}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="logoGradientInverted" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="accentGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      
      {/* Container Background */}
      <rect width="48" height="48" rx="14" fill={bgGradient} />
      <rect width="46" height="46" x="1" y="1" rx="13" stroke="white" strokeOpacity="0.1" fill="none" />
      
      {/* Structural S & M Isometric Geometry */}
      <path
        d="M14 15C14 13.3431 15.3431 12 17 12H31C32.6569 12 34 13.3431 34 15V19C34 20.6569 32.6569 22 31 22H23V26H31C32.6569 26 34 27.3431 34 29V33C34 34.6569 32.6569 36 31 36H17C15.3431 36 14 34.6569 14 33V15Z"
        fill="url(#accentGlow)"
        opacity="0.2"
      />
      
      {/* Site Master Chevron Shield */}
      <path
        d="M13 14H24C28.4183 14 32 17.5817 32 22C32 26.4183 28.4183 30 24 30H18V34H13V14Z"
        fill={inverted ? '#FFFFFF' : '#0EA5E9'}
      />
      <path
        d="M24 18H33C34.6569 18 36 19.3431 36 21V31C36 32.6569 34.6569 34 33 34H28V24C28 20.6863 25.3137 18 22 18H24Z"
        fill={inverted ? '#93C5FD' : '#38BDF8'}
      />
      
      {/* Precision Node Dots */}
      <circle cx="24" cy="22" r="2.2" fill={inverted ? '#0EA5E9' : '#FFFFFF'} />
      <circle cx="32" cy="14" r="1.8" fill="#10B981" />
    </svg>
  )
}

export function Logo({
  className,
  showWordmark = true,
  size = 'md',
  to = '/',
  inverted = false,
}: LogoProps) {
  const { mark, text } = sizeMap[size]

  return (
    <Link
      to={to}
      className={cn(
        'group inline-flex items-center gap-3 transition-all duration-200',
        className
      )}
      aria-label={`${APP_NAME} home`}
    >
      <LogoMark size={mark} inverted={inverted} />
      {showWordmark && (
        <span
          className={cn(
            'font-display font-extrabold tracking-tight',
            text,
            inverted ? 'text-white' : 'text-slate-900'
          )}
        >
          Site
          <span className={inverted ? 'text-sky-300' : 'text-sky-500'}>Master</span>
        </span>
      )}
    </Link>
  )
}

