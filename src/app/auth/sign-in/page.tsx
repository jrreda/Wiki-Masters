import { signInWithEmail } from "@/app/auth/actions";
import { AuthForm } from "@/components/auth-form";

export default function SignInPage() {
  return (
    <main className="px-4">
      <AuthForm mode="sign-in" action={signInWithEmail} />
    </main>
  );
}
