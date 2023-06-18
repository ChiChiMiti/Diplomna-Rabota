import { User } from "./user";

export type Message = {
  creatorId: string;
  requestId: string;
  id: string;
  body: string;
  createdAt: Date;
};

export const isAdminMessage = (message: Message, users: User[]) => {
  const user = users.find((u) => message.creatorId === u.id);

  return user?.role === "admin";
};
