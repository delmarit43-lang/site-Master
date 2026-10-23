import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Send } from 'lucide-react'
import { Section, SectionHeader } from '@/components/landing/Section'
import { Button } from '@/components/ui/button'
import { FloatingField, FloatingTextarea } from '@/components/ui/floating-field'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  company: z.string().min(1, 'Company or organization is required'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
})

type ContactFormValues = z.infer<typeof contactSchema>

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      message: '',
    },
  })

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 400))
    toast.success('Message received', {
      description: 'Thanks for reaching out. We’ll get back to you soon.',
    })
    reset()
  })

  return (
    <Section id="contact" className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_100%_0%,rgba(249,115,22,0.08),transparent_60%)]" />

      <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader
            eyebrow="Contact"
            title="Let’s talk about your sites"
            description="Tell us about your team and portfolio. We’ll follow up about demos, onboarding, or Enterprise plans."
            align="left"
          />
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-card sm:p-8 lg:col-span-7"
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FloatingField
              label="Name"
              autoComplete="name"
              error={errors.name?.message}
              {...register('name')}
            />
            <FloatingField
              label="Email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>

          <FloatingField
            label="Company"
            autoComplete="organization"
            error={errors.company?.message}
            {...register('company')}
          />

          <FloatingTextarea
            label="Message"
            rows={5}
            error={errors.message?.message}
            {...register('message')}
          />

          <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
            <Send className="h-4 w-4" />
            {isSubmitting ? 'Sending…' : 'Send message'}
          </Button>
        </form>
      </div>
    </Section>
  )
}
