import { AppHeader } from "@/components/app-header";
import { SubmitForm } from "@/components/submit-form";

export default function SubmitPage() {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Submit a Request
          </h1>
          <p className="text-sm text-muted-foreground">
            Provide clear context so reviewers can triage quickly.
          </p>
        </div>
        <div className="mt-6">
          <SubmitForm />
        </div>
      </main>
    </div>
  );
}
