import { createMessage, createEmail } from "@/api";
import { useAuth } from "@/context/auth-context";
import { Request, Service, User } from "@/models";
import { Message } from "@/models/message";
import { Textarea, Button, useToast } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "next-i18next";

type Props = {
  request: Request;
  users: User[];
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  services: Service[];
};

export const ResponseCard = ({
  request,
  users,
  setMessages,
  messages,
  services,
}: Props) => {
  const { t } = useTranslation();

  const [response, setResponse] = useState("");

  const { authUser } = useAuth();

  const toast = useToast();

  return (
    <>
      <Textarea
        id="response"
        placeholder={t("comment_the_request") || ""}
        _placeholder={{ color: "black" }}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
      />
      <Button
        onClick={async () => {
          if (!response) return;

          if (!authUser?.id) return;

          try {
            const createdMessage = await createMessage({
              requestId: request.id,
              body: response,
              createdAt: new Date(),
              creatorId: authUser?.id,
            });

            setMessages([
              ...messages,
              {
                requestId: request.id,
                body: response,
                createdAt: new Date(),
                creatorId: authUser?.id,
                id: createdMessage.id,
              },
            ]);

            const patient = users.find((u) => u.id === request.patientId);

            const recipient =
              authUser.id === patient?.id
                ? users.find((u) => u.role === "admin")?.email
                : patient?.email;

            if (recipient) {
              const serviceTitles = services
                .filter((s) => request.serviceIds.includes(s.id))
                .map((s) => s.title)
                .join(", ");

              await createEmail({
                to: recipient,
                message: {
                  subject: t("request_response"),
                  html:
                    t("received_response", {
                      services: `услуг${
                        request.serviceIds.length > 0 ? "и" : "а"
                      } ${serviceTitles}`,
                      response,
                    }) +
                    ` - <a href="https://medictrans-oncall.com">https://medictrans-oncall.com</a>`,
                  text:
                    t("received_response", {
                      services: `услуг${
                        request.serviceIds.length > 0 ? "и" : "а"
                      } ${serviceTitles}`,
                      response,
                    }) +
                    ` - <a href="https://medictrans-oncall.com">https://medictrans-oncall.com</a>`,
                },
              });

              console.log("sent email");
            }

            setResponse("");
            toast({
              title: t("sent_response_success"),
              status: "success",
              duration: 5000,
              isClosable: true,
            });
          } catch (e) {
            console.error(e);
            toast({
              title: t("sent_response_fail"),
              description: t("please_try_again"),
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }}
      >
        {t("send")}
      </Button>
    </>
  );
};
