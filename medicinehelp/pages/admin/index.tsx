import {
  deleteService,
  getMessages,
  getQuestions,
  getRequests,
  getServices,
  getUsers,
  updateRequest,
  updateService,
} from "@/api";
import {
  hasMessages,
  isLastMessageFromAdmin,
  Locale,
  Question,
  Request,
  Service,
  ServiceType,
  User,
} from "@/models";
import {
  Box,
  Button,
  Divider,
  Heading,
  Stack,
  Text,
  EditablePreview,
  useColorModeValue,
  IconButton,
  useEditableControls,
  ButtonGroup,
  Editable,
  Tooltip,
  EditableTextarea,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Textarea,
  useToast,
  css,
  Flex,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { formatDistance, isValid } from "date-fns";
import { bg, enUS } from "date-fns/locale";
import { useRouter } from "next/router";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/auth-context";
import { Message } from "@/models/message";
import { MessageCard } from "../../components/MessageCard";
import { ResponseCard } from "../../components/ResponseCard";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Admin() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [style, setStyle] = useState({ display: "none" });
  const [serviceToDelete, setServiceToDelete] = useState("");
  const [response, setResponse] = useState("");

  const { authUser } = useAuth();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const router = useRouter();

  const toast = useToast();

  const { t, i18n } = useTranslation();

  const fetchServices = async () => {
    const data = await getServices(i18n.language as Locale);
    setServices(data);
  };

  const fetchQuestions = async () => {
    const data = await getQuestions();
    setQuestions(data);
  };

  useEffect(() => {
    fetchServices();
    fetchQuestions();
  }, [i18n.language]);

  useEffect(() => {
    if (authUser?.role && authUser?.role !== "admin") {
      router.push("/", undefined, { locale: i18n.language });
    }
  }, [authUser?.role]);

  const fetchRequests = async () => {
    const requests = await getRequests();
    setRequests(requests);

    const data = (
      await Promise.all(requests.map((r) => r.id).map((id) => getMessages(id)))
    ).flat();
    setMessages(data);
  };

  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  function EditableControls() {
    const {
      isEditing,
      getSubmitButtonProps,
      getCancelButtonProps,
      getEditButtonProps,
    } = useEditableControls();

    const submitProps = getSubmitButtonProps();
    const cancelProps = getCancelButtonProps();

    useEffect(() => {
      if (isEditing) {
        setStyle({ display: "none" });
      }
    }, [isEditing]);

    return isEditing ? (
      <ButtonGroup justifyContent="end" size="sm" w="full" spacing={2} mt={2}>
        <IconButton
          icon={<CheckIcon />}
          {...{ ...submitProps, "aria-label": submitProps["aria-label"] || "" }}
        />
        <IconButton
          icon={<CloseIcon boxSize={3} />}
          {...{ ...cancelProps, "aria-label": cancelProps["aria-label"] || "" }}
        />
      </ButtonGroup>
    ) : null;
  }

  const calculatePercentUsersWithRequests = () => {
    const patientIds = requests.map((request) => request.patientId);
    const uniquePatientIds = Array.from(new Set(patientIds));

    let numUsersWithRequests = 0;
    for (const user of users) {
      if (uniquePatientIds.includes(user.id)) {
        numUsersWithRequests++;
      }
    }

    return ((numUsersWithRequests / users.length) * 100).toFixed(2);
  };

  useEffect(() => {
    if (authUser?.role !== "admin") {
      return;
    }

    fetchRequests();

    fetchUsers();
  }, [authUser?.id, authUser?.role]);

  return (
    <Stack py={8} px={3}>
      <Tabs>
        <TabList
          overflowX="auto"
          overflowY="hidden"
          css={css({
            scrollbarWidth: "none",
            "-webkit-overflow-scrolling": "touch",
            boxShadow: "inset 0 -2px 0 rgba(0, 0, 0, 0.1)",
            border: "0 none",
          })}
        >
          <Tab>{t("new_requests")}</Tab>
          <Tab>{t("answered_requests")}</Tab>
          <Tab>{t("commented_requests")}</Tab>
          <Tab>{t("ended_requests")}</Tab>
          <Tab>{t("questions")}</Tab>
          <Tab>{t("statistics")}</Tab>
          <Tab>{t("change_services")}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box
              borderWidth="1px"
              rounded="lg"
              shadow="1px 1px 3px rgba(0,0,0,0.3)"
              maxWidth={800}
              p={6}
              m="10px auto"
            >
              {requests.filter(
                (r) => !hasMessages(r.id, messages) && !r.canceled
              ).length ? (
                requests
                  .filter((r) => !hasMessages(r.id, messages) && !r.canceled)
                  .map((request) => {
                    const title =
                      request.serviceIds.length > 1
                        ? t("services")
                        : t("service");

                    return (
                      <Stack
                        key={request.id}
                        borderRadius="base"
                        padding="5"
                        marginBottom={5}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {request.appointment &&
                            isValid(request.appointment) && (
                              <Text
                                color={"black"}
                                textTransform={"uppercase"}
                                fontWeight={800}
                                fontSize={"sm"}
                                letterSpacing={1.1}
                              >
                                {formatDistance(
                                  request.appointment,
                                  new Date(),
                                  {
                                    addSuffix: true,
                                    locale: i18n.language === 'bg' ? bg : enUS,
                                  }
                                )}
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
                              {t("cancel")}
                            </Button>
                          ) : (
                            <Text fontWeight="bold">{t("canceled")}</Text>
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
                          {t("hospital_address")}: {request.hospitalStreet}
                        </Text>
                        <Text color={"black"}>
                          {t("hospital_city")}: {request.hospitalCity}
                        </Text>
                        <Text color={"black"}>
                          {t("hospital_country")}: {request.hospitalCountry}
                        </Text>
                        <Text color={"black"}>
                          {t("additional")}: {request.additional}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_name")}: {request.patientFirstName}{" "}
                          {request.patientLastName}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_phone")}: {request.patientPhone}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_street")}: {request.patientStreet}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_city")}: {request.patientCity}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_country")}: {request.patientCountry}
                        </Text>
                        <Divider />
                        {messages.length && (
                          <Heading fontSize={"lg"} fontFamily={"body"}>
                            {t("messages")}:
                          </Heading>
                        )}
                        {messages
                          .filter((m) => m.requestId === request.id)
                          .map((m) => (
                            <MessageCard users={users} key={m.id} message={m} />
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
                <Text fontWeight="bold">{t("no_new_requests_yet")}</Text>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              borderWidth="1px"
              rounded="lg"
              shadow="1px 1px 3px rgba(0,0,0,0.3)"
              maxWidth={800}
              p={6}
              m="10px auto"
            >
              {requests.filter(
                (r) =>
                  isLastMessageFromAdmin(r.id, messages, users) && !r.canceled
              ).length ? (
                requests
                  .filter(
                    (r) =>
                      isLastMessageFromAdmin(r.id, messages, users) &&
                      !r.canceled
                  )
                  .map((request) => {
                    const title =
                      request.serviceIds.length > 1
                        ? t("services")
                        : t("service");

                    return (
                      <Stack
                        key={request.id}
                        borderRadius="base"
                        padding="5"
                        marginBottom={5}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {request.appointment &&
                            isValid(request.appointment) && (
                              <Text
                                color={"black"}
                                textTransform={"uppercase"}
                                fontWeight={800}
                                fontSize={"sm"}
                                letterSpacing={1.1}
                              >
                                {formatDistance(
                                  request.appointment,
                                  new Date(),
                                  {
                                    addSuffix: true,
                                    locale: i18n.language === 'bg' ? bg : enUS,
                                  }
                                )}
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
                              {t("cancel")}
                            </Button>
                          ) : (
                            <Text fontWeight="bold">{t("canceled")}</Text>
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
                          {t("hospital_address")}: {request.hospitalStreet}
                        </Text>
                        <Text color={"black"}>
                          {t("hospital_city")}: {request.hospitalCity}
                        </Text>
                        <Text color={"black"}>
                          {t("hospital_country")}: {request.hospitalCountry}
                        </Text>
                        <Text color={"black"}>
                          {t("additional")}: {request.additional}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_name")}: {request.patientFirstName}{" "}
                          {request.patientLastName}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_phone")}: {request.patientPhone}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_street")}: {request.patientStreet}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_city")}: {request.patientCity}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_country")}: {request.patientCountry}
                        </Text>
                        <Divider />
                        {messages.length && (
                          <Heading fontSize={"lg"} fontFamily={"body"}>
                            {t("messages")}:
                          </Heading>
                        )}
                        {messages
                          .filter((m) => m.requestId === request.id)
                          .map((m) => (
                            <MessageCard users={users} key={m.id} message={m} />
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
                <Text fontWeight="bold">{t("no_answered_requests_yet")}</Text>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              borderWidth="1px"
              rounded="lg"
              shadow="1px 1px 3px rgba(0,0,0,0.3)"
              maxWidth={800}
              p={6}
              m="10px auto"
            >
              {requests.filter(
                (r) =>
                  hasMessages(r.id, messages) &&
                  !isLastMessageFromAdmin(r.id, messages, users) &&
                  !r.canceled
              ).length ? (
                requests
                  .filter(
                    (r) =>
                      hasMessages(r.id, messages) &&
                      !isLastMessageFromAdmin(r.id, messages, users) &&
                      !r.canceled
                  )
                  .map((request) => {
                    const title =
                      request.serviceIds.length > 1 ? t("services") : "service";

                    return (
                      <Stack
                        key={request.id}
                        borderRadius="base"
                        padding="5"
                        marginBottom={5}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {request.appointment &&
                            isValid(request.appointment) && (
                              <Text
                                color={"black"}
                                textTransform={"uppercase"}
                                fontWeight={800}
                                fontSize={"sm"}
                                letterSpacing={1.1}
                              >
                                {formatDistance(
                                  request.appointment,
                                  new Date(),
                                  {
                                    addSuffix: true,
                                    locale: i18n.language === 'bg' ? bg : enUS,
                                  }
                                )}
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
                              {t("cancel")}
                            </Button>
                          ) : (
                            <Text fontWeight="bold">{t("canceled")}</Text>
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
                          {t("hospital_address")}: {request.hospitalStreet}
                        </Text>
                        <Text color={"black"}>
                          {t("hospital_city")}: {request.hospitalCity}
                        </Text>
                        <Text color={"black"}>
                          {t("hospital_country")}: {request.hospitalCountry}
                        </Text>
                        <Text color={"black"}>
                          {t("additional")}: {request.additional}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_name")}: {request.patientFirstName}{" "}
                          {request.patientLastName}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_phone")}: {request.patientPhone}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_street")}: {request.patientStreet}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_city")}: {request.patientCity}
                        </Text>
                        <Text color={"black"}>
                          {t("patient_country")}: {request.patientCountry}
                        </Text>
                        <Divider />
                        {messages.length && (
                          <Heading fontSize={"lg"} fontFamily={"body"}>
                            {t("messages")}:
                          </Heading>
                        )}
                        <Flex
                          w="100%"
                          h="80%"
                          overflowY="scroll"
                          flexDirection="column"
                          p="3"
                        >
                          {messages
                            .filter((m) => m.requestId === request.id)
                            .map((m) => (
                              <MessageCard
                                users={users}
                                key={m.id}
                                message={m}
                              />
                            ))}
                        </Flex>

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
                <Text fontWeight="bold">{t("no_commented_requests_yet")}</Text>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              borderWidth="1px"
              rounded="lg"
              shadow="1px 1px 3px rgba(0,0,0,0.3)"
              maxWidth={800}
              p={6}
              m="10px auto"
            >
              {requests.filter((r) => r.canceled).length ? (
                requests
                  .filter((r) => r.canceled)
                  .map((request) => {
                    const title =
                      request.serviceIds.length > 1 ? t('services') : t('service');

                    return (
                      <Stack
                        key={request.id}
                        borderRadius="base"
                        padding="5"
                        marginBottom={5}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {request.appointment &&
                            isValid(request.appointment) && (
                              <Text
                                color={"black"}
                                textTransform={"uppercase"}
                                fontWeight={800}
                                fontSize={"sm"}
                                letterSpacing={1.1}
                              >
                                {formatDistance(
                                  request.appointment,
                                  new Date(),
                                  {
                                    addSuffix: true,
                                    locale: i18n.language === 'bg' ? bg : enUS,
                                  }
                                )}
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
                          {t('hospital_address')}: {request.hospitalStreet}
                        </Text>
                        <Text color={"black"}>
                          {t('hospital_city')}: {request.hospitalCity}
                        </Text>
                        <Text color={"black"}>
                          {t('hospital_country')}: {request.hospitalCountry}
                        </Text>
                        <Text color={"black"}>
                          {t('additional')}: {request.additional}
                        </Text>
                        <Text color={"black"}>
                          {t('patient_name')}: {request.patientFirstName}{" "}
                          {request.patientLastName}
                        </Text>
                        <Text color={"black"}>
                          {t('patient_phone')}: {request.patientPhone}
                        </Text>
                        <Text color={"black"}>
                          {t('patient_street')}: {request.patientStreet}
                        </Text>
                        <Text color={"black"}>
                          {t('patient_city')}: {request.patientCity}
                        </Text>
                        <Text color={"black"}>
                          {t('patient_country')}: {request.patientCountry}
                        </Text>
                        <Divider />
                      </Stack>
                    );
                  })
              ) : (
                <Text fontWeight="bold">{t('no_ended_requests_yet')}</Text>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              borderWidth="1px"
              rounded="lg"
              shadow="1px 1px 3px rgba(0,0,0,0.3)"
              maxWidth={800}
              p={6}
              m="10px auto"
            >
              {questions.length ? (
                questions.map((question) => {
                  const title = question.creatorName;

                  return (
                    <Stack
                      key={question.id}
                      borderRadius="base"
                      padding="5"
                      marginBottom={5}
                    >
                      {question.createdAt && isValid(question.createdAt) && (
                        <Text
                          color={"black"}
                          textTransform={"uppercase"}
                          fontWeight={800}
                          fontSize={"sm"}
                          letterSpacing={1.1}
                        >
                          {formatDistance(question.createdAt, new Date(), {
                            addSuffix: true,
                            locale: i18n.language === 'bg' ? bg : enUS,
                          })}
                        </Text>
                      )}

                      <Heading fontSize={"2xl"} fontFamily={"body"}>
                        {title}
                      </Heading>
                      <Text color={"black"}>{question.message}</Text>
                      <Heading fontSize="md" fontFamily={"body"}>
                        {t('email')}: {question.creatorEmail}
                      </Heading>
                      <Heading fontSize="md" fontFamily={"body"}>
                        {t('phone_number')}: {question.creatorPhone}
                      </Heading>
                      <Divider />
                    </Stack>
                  );
                })
              ) : (
                <Text fontWeight="bold">{t('no_questions_yet')}</Text>
              )}
            </Box>
          </TabPanel>
          <TabPanel>
            <Box
              borderWidth="1px"
              rounded="lg"
              shadow="1px 1px 3px rgba(0,0,0,0.3)"
              maxWidth={800}
              p={6}
              m="10px auto"
            >
              <Text color={"black"}>
                {t("number_of_patients")}:{" "}
                {users.filter((u) => u.role !== "admin").length}
              </Text>
              <Divider />
              <Text color={"black"}>
                {t("users_created_request_percentage")}:{" "}
                {calculatePercentUsersWithRequests()} %
              </Text>
              <Text color={"black"}>
                {t("number_of_requests")}: {requests.length}
              </Text>
            </Box>
          </TabPanel>
          <TabPanel>
            <Heading fontSize={"2xl"} fontFamily={"body"} mb="5%">
              {t("services")}:
            </Heading>
            {services.map((service, i) => (
              <Box
                key={service.id || i}
                onMouseEnter={(e) => {
                  setStyle({ display: "block" });
                }}
                onMouseLeave={(e) => {
                  setStyle({ display: "none" });
                }}
              >
                <Text fontWeight="bold">{t("title")} (български):</Text>
                <Editable
                  key={service.bgTitle}
                  defaultValue={service.bgTitle}
                  isPreviewFocusable={true}
                  selectAllOnFocus={false}
                  onSubmit={async (e) => {
                    await updateService({ bgTitle: e as ServiceType });
                  }}
                  style={{
                    display: "flex",
                    padding: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Tooltip
                    label={t("click_to_change")}
                    shouldWrapChildren={true}
                  >
                    <EditablePreview
                      py={2}
                      px={4}
                      _hover={{
                        background: useColorModeValue("gray.100", "gray.700"),
                      }}
                    />
                  </Tooltip>
                  <EditableTextarea rows={3} w="100%" as={EditableTextarea} />
                  <EditableControls />
                </Editable>
                <Text fontWeight="bold">{t("title")} (английски):</Text>
                <Editable
                  key={service.enTitle}
                  defaultValue={service.enTitle}
                  isPreviewFocusable={true}
                  selectAllOnFocus={false}
                  onSubmit={async (e) => {
                    await updateService({ enTitle: e as ServiceType });
                  }}
                  style={{
                    display: "flex",
                    padding: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <Tooltip
                    label={t("click_to_change")}
                    shouldWrapChildren={true}
                  >
                    <EditablePreview
                      py={2}
                      px={4}
                      _hover={{
                        background: useColorModeValue("gray.100", "gray.700"),
                      }}
                    />
                  </Tooltip>
                  <EditableTextarea rows={3} w="100%" as={EditableTextarea} />
                  <EditableControls />
                </Editable>
                <Text fontWeight="bold">{t("description")} (български):</Text>
                <Editable
                  key={service.bgDescription}
                  defaultValue={service.bgDescription}
                  isPreviewFocusable={true}
                  selectAllOnFocus={false}
                  onSubmit={async (e) => {
                    await updateService({ bgDescription: e });
                  }}
                >
                  <Tooltip
                    label={t("click_to_change")}
                    shouldWrapChildren={true}
                  >
                    <EditablePreview
                      py={2}
                      px={4}
                      _hover={{
                        background: useColorModeValue("gray.100", "gray.700"),
                      }}
                    />
                  </Tooltip>
                  <EditableTextarea rows={18} as={EditableTextarea} />
                  <Button
                    colorScheme="red"
                    color="white"
                    onClick={() => {
                      setServiceToDelete(service.id);
                      onOpen();
                    }}
                    style={style}
                  >
                    {t("delete")}
                  </Button>
                  <EditableControls />
                </Editable>
                <Text fontWeight="bold">{t("description")} (английски):</Text>
                <Editable
                  key={service.enDescription}
                  defaultValue={service.enDescription}
                  isPreviewFocusable={true}
                  selectAllOnFocus={false}
                  onSubmit={async (e) => {
                    await updateService({ enDescription: e });
                  }}
                >
                  <Tooltip
                    label={t("click_to_change")}
                    shouldWrapChildren={true}
                  >
                    <EditablePreview
                      py={2}
                      px={4}
                      _hover={{
                        background: useColorModeValue("gray.100", "gray.700"),
                      }}
                    />
                  </Tooltip>
                  <EditableTextarea rows={18} as={EditableTextarea} />
                  <Button
                    colorScheme="red"
                    color="white"
                    onClick={() => {
                      setServiceToDelete(service.id);
                      onOpen();
                    }}
                    style={style}
                  >
                    {t("delete")}
                  </Button>
                  <EditableControls />
                </Editable>
                <Divider />
              </Box>
            ))}
            <Button
              mt="5%"
              mb="5%"
              onClick={async () => {
                // setServices([
                //   ...services,
                //   {
                //     bgTitle: "Нова услуга",
                //     enTitle: "New service",
                //     bgDescription: "Описание на нова услуга",
                //     enDescription: "Description of new service",
                //     id: "",
                //   },
                // ]);
              }}
            >
              {t("add_service")}
            </Button>
            <AlertDialog
              isOpen={isOpen}
              leastDestructiveRef={cancelRef}
              onClose={onClose}
            >
              <AlertDialogOverlay>
                <AlertDialogContent>
                  <AlertDialogHeader fontSize="lg" fontWeight="bold">
                    {t("delete_service")}
                  </AlertDialogHeader>

                  <AlertDialogBody>{t("delete_are_you_sure")}</AlertDialogBody>

                  <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                      {t("back")}
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={async () => {
                        if (!serviceToDelete) {
                          return;
                        }

                        try {
                          await deleteService(serviceToDelete);
                          setServices(
                            services.filter((s) => s.id !== serviceToDelete)
                          );
                        } catch (e) {
                          console.error(e);
                        } finally {
                          onClose();
                        }
                      }}
                      ml={3}
                    >
                      {t("delete")}
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogOverlay>
            </AlertDialog>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
}
