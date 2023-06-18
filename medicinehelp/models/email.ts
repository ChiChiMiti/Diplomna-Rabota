type EmailMessage = {
  subject: string;
  text: string;
  html: string;
}

export type Email = {
  to: string;
  message: EmailMessage;
}