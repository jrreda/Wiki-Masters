import { signUpWithEmail } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";

export default function SignUpPage() {
  return (
    <main className="px-4">
      <AuthForm mode="sign-up" action={signUpWithEmail} />
    </main>
  );
}
