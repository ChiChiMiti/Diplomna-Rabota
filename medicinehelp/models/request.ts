import { Message } from "./message";
import { User } from "./user";

export type Request = {
  id: string;
  patientFirstName: string;
  patientLastName: string;
  patientPhone: string;
  patientId: string;
  appointment: Date;
  createdAt: Date;
  patientStreet: string;
  patientCity: string;
  patientCountry: string;
  serviceIds: string[];
  hospitalStreet: string;
  hospitalCity: string;
  hospitalCountry: string;
  additional: string;
  response: string;
  canceled: boolean;
};

export const hasAppointmentPassed = (request: Request) => {
  const currentDateTime = new Date();
  const appointmentDateTime = new Date(request.appointment);

  return Boolean(currentDateTime > appointmentDateTime);
};

export const sortRequests = (requests: Request[]): Request[] => {
  const currentDateTime = new Date();

  const sortedRequests = requests.sort((a, b) => {
    if (a.canceled && !b.canceled) {
      return 1;
    } else if (!a.canceled && b.canceled) {
      return -1;
    }

    return a.appointment.getTime() - b.appointment.getTime();
  });

  const futureRequests = sortedRequests.filter(
    (request) => request.appointment > currentDateTime && !request.canceled
  );

  const pastRequests = sortedRequests.filter(
    (request) => request.appointment <= currentDateTime && !request.canceled
  );

  const canceledRequests = sortedRequests.filter((request) => request.canceled);

  return [...futureRequests, ...pastRequests, ...canceledRequests];
};

export const hasMessages = (requestId: string, messages: Message[]) => {
  return messages.some((message) => message.requestId === requestId);
};

export const isAdminMessage = (message: Message, users: User[]) => {
  const user = users.find((u) => message.creatorId === u.id);

  return user?.role === "admin";
};

export const hasAdminMessages = (
  requestId: string,
  messages: Message[],
  users: User[]
) => {
  return messages.some(
    (message) =>
      message.requestId === requestId && isAdminMessage(message, users)
  );
};

export const isLastMessageFromAdmin = (
  requestId: string,
  messages: Message[],
  users: User[]
) => {
  const adminMessages = messages.filter(
    (message) =>
      message.requestId === requestId && isAdminMessage(message, users)
  );

  const lastAdminMessage = adminMessages[adminMessages.length - 1];

  const userMessages = messages.filter(
    (message) =>
      message.requestId === requestId && !isAdminMessage(message, users)
  );

  const lastUserMessage = userMessages[userMessages.length - 1];

  return lastAdminMessage && !lastUserMessage;
};
