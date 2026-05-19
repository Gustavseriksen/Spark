import { SignupForm } from "@/components/signup-form"
import { RedirectIfAuthed } from "@/components/redirect-if-authed"

export default function SignupPage() {
  return (
    <RedirectIfAuthed>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <SignupForm />
        </div>
      </div>
    </RedirectIfAuthed>
  )
}
