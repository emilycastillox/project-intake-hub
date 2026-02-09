"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createRequest,
  reviewRequest,
  createProject,
  convertToTicket,
  moveTicket,
  assignTicket,
  addRequirement,
  toggleRequirement,
  removeRequirement,
} from "./store";
import type { ImpactArea, Urgency, ReviewAction, BoardColumn } from "@/types";

export async function submitRequest(formData: FormData) {
  const title = formData.get("title") as string;
  const businessContext = formData.get("businessContext") as string;
  const impactArea = formData.get("impactArea") as ImpactArea;
  const urgency = formData.get("urgency") as string as Urgency;
  const requesterName = formData.get("requesterName") as string;

  if (!title || !businessContext || !impactArea || !urgency || !requesterName) {
    throw new Error("All fields are required");
  }

  createRequest({ title, businessContext, impactArea, urgency, requesterName });
  redirect("/");
}

export async function triageRequest(formData: FormData) {
  const id = formData.get("id") as string;
  const action = formData.get("action") as ReviewAction;
  const note = formData.get("note") as string;

  if (!id || !action) {
    throw new Error("Missing required fields");
  }

  reviewRequest(id, action, note || undefined);
  redirect(`/requests/${id}`);
}

// ---- Project actions ----

export async function createProjectAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) {
    throw new Error("Project name is required");
  }

  const project = createProject({ name, description: description || undefined });
  return project;
}

export async function addToProjectAction(formData: FormData) {
  const projectId = formData.get("projectId") as string;
  const intakeRequestId = formData.get("intakeRequestId") as string;
  const newProjectName = formData.get("newProjectName") as string;

  if (!intakeRequestId) {
    throw new Error("Missing intake request ID");
  }

  let targetProjectId = projectId;

  // Create new project if requested
  if (!projectId && newProjectName) {
    const project = createProject({ name: newProjectName });
    targetProjectId = project.id;
  }

  if (!targetProjectId) {
    throw new Error("Please select or create a project");
  }

  const ticket = convertToTicket({
    projectId: targetProjectId,
    intakeRequestId,
  });

  if (!ticket) {
    throw new Error("Could not convert request to ticket");
  }

  redirect(`/projects/${targetProjectId}`);
}

export async function moveTicketAction(
  ticketId: string,
  column: BoardColumn,
  projectId: string,
) {
  moveTicket(ticketId, column);
  revalidatePath(`/projects/${projectId}`);
}

export async function assignTicketAction(
  ticketId: string,
  assignee: string,
  projectId: string,
) {
  assignTicket(ticketId, assignee || undefined);
  revalidatePath(`/projects/${projectId}`);
}

// ---- Requirement actions ----

export async function addRequirementAction(
  ticketId: string,
  text: string,
  projectId: string,
) {
  if (!text.trim()) throw new Error("Requirement text is required");
  addRequirement(ticketId, text.trim());
  revalidatePath(`/projects/${projectId}/tickets/${ticketId}`);
}

export async function toggleRequirementAction(
  ticketId: string,
  requirementId: string,
  projectId: string,
) {
  toggleRequirement(ticketId, requirementId);
  revalidatePath(`/projects/${projectId}/tickets/${ticketId}`);
}

export async function removeRequirementAction(
  ticketId: string,
  requirementId: string,
  projectId: string,
) {
  removeRequirement(ticketId, requirementId);
  revalidatePath(`/projects/${projectId}/tickets/${ticketId}`);
}
