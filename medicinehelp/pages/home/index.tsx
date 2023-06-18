import {
  getMessages,
  getRequestsByPatientId,
  getServices,
  getUsers,
  updateRequest,
} from "@/api";
import { Locale, Request, Service, sortRequests, User } from "@/models";
import {
  Box,
  Button,
  Divider,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { formatDistance } from "date-fns";
import { bg, enUS } from "date-fns/locale";
import { useRouter } from "next/router";
import { useAuth } from "@/context/auth-context";
import { Message } from "@/models/message";
import { MessageCard } from "../../components/MessageCard";
import { ResponseCard } from "../../components/ResponseCard";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Home() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const { authUser } = useAuth();

  const router = useRouter();

  const toast = useToast();

  const { t, i18n } = useTranslation();

  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  const fetchRequests = async (userId: string) => {
    const requests = await getRequestsByPatientId(userId);
    setRequests(requests);

    const data = (
      await Promise.all(requests.map((r) => r.id).map((id) => getMessages(id)))
    ).flat();
    setMessages(data);
  };

  const fetchServices = async () => {
    const data = await getServices(i18n.language as Locale);
    setServices(data);
  };

  useEffect(() => {
    if (!authUser?.id) return;

    fetchRequests(authUser.id);
    fetchServices();
    fetchUsers();
  }, [authUser?.id, i18n.language]);

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="bold" mb="5%" mt="5%">
        {t('my_requests')}
      </Heading>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
      >
        {requests.length ? (
          sortRequests(requests).map((request) => {
            const title = request.serviceIds.length > 1 ? t('services') : t('service');

            return (
              <Stack
                key={request.id}
                borderRadius="base"
                padding="5"
                marginBottom={5}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  {request.appointment && (
                    <Text
                      color={"black"}
                      textTransform={"uppercase"}
                      fontWeight={800}
                      fontSize={"sm"}
                      letterSpacing={1.1}
                    >
                      {formatDistance(request.appointment, new Date(), {
                        addSuffix: true,
                        locale: i18n.language === 'bg' ? bg : enUS,
                      })}
                    </Text>
                  )}
                  {!request.canceled ? (
                    <Button
                      onClick={async () => {
                        try {
                          await updateRequest({
                            ...request,
                            id: request.id,
                            canceled: true,
                          });

                          const updatedItems = [...requests];

                          const index = updatedItems.findIndex(
                            (item) => item.id === request.id
                          );

                          if (index !== -1) {
                            updatedItems[index] = {
                              ...updatedItems[index],
                              canceled: true,
                            };

                            setRequests(updatedItems);
                          }
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    >
                      {t('cancel')}
                    </Button>
                  ) : (
                    <Text fontWeight="bold">{t('canceled')}</Text>
                  )}
                </div>

                <Heading fontSize={"2xl"} fontFamily={"body"}>
                  {title}:{" "}
                  {services
                    .filter((s) => request.serviceIds.includes(s.id))
                    .map((s) => s.title)
                    .join(", ")}
                </Heading>
                <Text color={"black"}>
                  {t('hospital_city')}: {request.hospitalStreet}
                </Text>
                <Text color={"black"}>
                  {t('hospital_city')}: {request.hospitalCity}
                </Text>
                <Text color={"black"}>
                  {t('hospital_country')}: {request.hospitalCountry}
                </Text>
                <Divider />
                {messages.length && (
                  <Heading fontSize={"lg"} fontFamily={"body"}>
                    {t('messages')}:
                  </Heading>
                )}
                {messages
                  .filter((m) => m.requestId === request.id)
                  .map((m) => (
                    <MessageCard message={m} users={users} key={m.id} />
                  ))}
                <ResponseCard
                  messages={messages}
                  request={request}
                  services={services}
                  setMessages={setMessages}
                  users={users}
                  key={request.id}
                />
                <Divider />
              </Stack>
            );
          })
        ) : (
          <Text fontWeight="bold">{t('no_requests_yet')}</Text>
        )}
      </Box>
      <Stack mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Button
          bg={"red.400"}
          color={"white"}
          _hover={{
            bg: "red.500",
          }}
          onClick={() => {
            router.push("/create", undefined, { locale: i18n.language });
          }}
        >
          {t('create_request')}
        </Button>
      </Stack>
    </>
  );
}
