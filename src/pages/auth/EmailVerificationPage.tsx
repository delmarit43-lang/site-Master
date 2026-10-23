import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { APP_NAME } from '@/constants/app'

export function EmailVerificationPage() {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    setResending(true)
    setResent(false)
    await new Promise((resolve) => setTimeout(resolve, 800))
    setResending(false)
    setResent(true)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-8 shadow-soft text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Mail className="h-7 w-7" />
      </div>

      <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
        Verify your email
      </h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        We&apos;ve sent a verification link to your inbox. Open the email and
        confirm your address to activate your {APP_NAME} account.
      </p>

      {resent && (
        <div className="mt-5 inline-flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2 text-sm text-success">
          <CheckCircle2 className="h-4 w-4" />
          Verification email resent
        </div>
      )}

      <div className="mt-8 space-y-3">
        <Button
          type="button"
          className="w-full"
          size="lg"
          onClick={handleResend}
          disabled={resending}
        >
          {resending ? (
            <>
              <Loader2 className="animate-spin" />
              Resending...
            </>
          ) : (
            'Resend verification email'
          )}
        </Button>

        <Button asChild variant="outline" className="w-full" size="lg">
          <Link to="/auth/login">Back to sign in</Link>
        </Button>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Didn&apos;t receive it? Check spam or try resending in a moment.
      </p>
    </div>
  )
}

export default EmailVerificationPage
