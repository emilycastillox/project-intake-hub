import React from "react";
import Link from "next/link";
import type { IntakeRequest } from "@/types";
import { StatusBadge } from "@/components/StatusBadge/StatusBadge";
import { UrgencyIndicator } from "@/components/UrgencyIndicator/UrgencyIndicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

const impactLabels: Record<string, string> = {
  product: "Product",
  engineering: "Engineering",
  operations: "Operations",
  design: "Design",
  other: "Other",
};

interface Props {
  requests: IntakeRequest[];
}

const RequestTable: React.FC<Props> = (props) => {
  const { requests } = props;

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-lg font-medium text-foreground">No requests yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit a new request to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Impact</TableHead>
            <TableHead className="hidden sm:table-cell">Urgency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden lg:table-cell text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((req) => (
            <TableRow key={req.id} className="group">
              <TableCell className="font-mono text-xs text-muted-foreground">
                {req.id}
              </TableCell>
              <TableCell>
                <Link
                  href={`/requests/${req.id}`}
                  className="font-medium text-foreground underline-offset-4 group-hover:underline"
                >
                  {req.title}
                </Link>
                <p className="mt-0.5 text-xs text-muted-foreground lg:hidden">
                  {req.requesterName}
                </p>
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {impactLabels[req.impactArea]}
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <UrgencyIndicator urgency={req.urgency} />
              </TableCell>
              <TableCell>
                <StatusBadge status={req.status} />
              </TableCell>
              <TableCell className="hidden lg:table-cell text-right text-sm text-muted-foreground">
                {formatDate(req.createdAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export { RequestTable };
