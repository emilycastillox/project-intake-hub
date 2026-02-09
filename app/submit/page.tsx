import React from "react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { SubmitForm } from "@/components/SubmitForm/SubmitForm";

interface Props {}

const SubmitPage: React.FC<Props> = (props) => {
  const {} = props;

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
};

export default SubmitPage;
