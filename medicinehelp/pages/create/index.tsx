import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import DateTimePicker from "react-datetime-picker";
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  GridItem,
  FormLabel,
  Input,
  Select,
  FormHelperText,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import {
  createEmail,
  createRequest,
  getRequests,
  getServices,
  updateUser,
} from "@/api";
import { useRouter } from "next/router";
import { Locale, Request, Service } from "@/models";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { useAuth } from "@/context/auth-context";
import MultiSelectMenu from "@/components/MultiSelectMenu";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  patientStreet: string;
  patientCity: string;
  patientCountry: string;
  services: Service[];
  hospitalStreet: string;
  hospitalCity: string;
  hospitalCountry: string;
  additional: string;
  appointment: Date;
};

type FormProps = {
  formData: FormData;
  setFormData: Dispatch<SetStateAction<FormData>>;
};

const Form1 = ({ formData, setFormData }: FormProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        {t("general_information")}
      </Heading>
      <Flex>
        <FormControl mr="5%">
          <FormLabel htmlFor="first-name" fontWeight={"normal"}>
            {t("first_name")}
          </FormLabel>
          <Input
            id="first-name"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </FormControl>

        <FormControl>
          <FormLabel htmlFor="last-name" fontWeight={"normal"}>
            {t("last_name")}
          </FormLabel>
          <Input
            id="last-name"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </FormControl>
      </Flex>
      <FormControl mt="2%">
        <FormLabel fontWeight={"normal"}>{t("phone_number")}</FormLabel>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value;

            const regex = /^[0-9+]+$/;

            if (regex.test(value) || !value) {
              setFormData({ ...formData, phone: e.target.value });
            }
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight={"normal"} mt="2%">
          {t("street")}
        </FormLabel>
        <Input
          id="street"
          value={formData.patientStreet}
          onChange={(e) =>
            setFormData({ ...formData, patientStreet: e.target.value })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight={"normal"} mt="2%">
          {t("city")}
        </FormLabel>
        <Input
          id="city"
          value={formData.patientCity}
          onChange={(e) =>
            setFormData({ ...formData, patientCity: e.target.value })
          }
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight={"normal"} mt="2%">
          {t("country")}
        </FormLabel>
        <Input
          id="country"
          value={formData.patientCountry}
          onChange={(e) =>
            setFormData({ ...formData, patientCountry: e.target.value })
          }
        />
      </FormControl>
    </>
  );
};

const Form2 = ({ formData, setFormData }: FormProps) => {
  const { t, i18n } = useTranslation();

  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);

  const fetchServices = async () => {
    const data = await getServices(i18n.language as Locale);
    setServices(data);
  };

  const fetchRequests = async () => {
    const data = await getRequests();
    setRequests(data);
  };

  const isDisabledDate = (date: Date) => {
    const matchingRequests = requests.filter((request) => {
      const requestDate = new Date(request.appointment);
      requestDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return requestDate.getTime() === date.getTime();
    });
    return matchingRequests.length > 15;
  };

  useEffect(() => {
    fetchServices();
    fetchRequests();
  }, [i18n.language]);

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="normal" mb="2%">
        {t("what_do_you_need")}
      </Heading>
      <FormControl as={GridItem} mt="2%">
        <FormLabel
          htmlFor="services"
          fontWeight="normal"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          {t("services")}
        </FormLabel>
        <MultiSelectMenu
          label="Избери услуги"
          options={services.map((s) => s.title)}
          onChange={(values) => {
            const selectedServices = services.filter((s) =>
              values.includes(s.title)
            );
            setFormData({ ...formData, services: selectedServices });
          }}
        />
        {formData.services.map(
          (s) =>
            s.description && (
              <FormHelperText key={s.id}>
                <Text fontWeight="bold">
                  {t("description_of")} {s.title}:
                </Text>
                {s.description}
              </FormHelperText>
            )
        )}
      </FormControl>

      <FormControl as={GridItem} mt="2%">
        <FormLabel
          htmlFor="hospitalStreet"
          fontWeight="normal"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          {t("hospital_address")}
        </FormLabel>
        <Input
          id="hospitalStreet"
          value={formData.hospitalStreet}
          onChange={(e) =>
            setFormData({ ...formData, hospitalStreet: e.target.value })
          }
        />
      </FormControl>

      <FormControl as={GridItem} mt="2%">
        <FormLabel
          htmlFor="hospitalCity"
          fontWeight="normal"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          {t("hospital_city")}
        </FormLabel>
        <Input
          id="hospitalCity"
          value={formData.hospitalCity}
          onChange={(e) =>
            setFormData({ ...formData, hospitalCity: e.target.value })
          }
        />
      </FormControl>

      <FormControl as={GridItem} mt="2%">
        <FormLabel
          htmlFor="hospitalCountry"
          fontWeight="normal"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          {t("hospital_country")}
        </FormLabel>
        <Input
          id="hospitalCountry"
          value={formData.hospitalCountry}
          onChange={(e) =>
            setFormData({ ...formData, hospitalCountry: e.target.value })
          }
        />
      </FormControl>

      <FormControl as={GridItem} mt="2%">
        <FormLabel
          htmlFor="additional"
          fontWeight="normal"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          {t("additional")}
        </FormLabel>
        <Textarea
          id="additional"
          value={formData.additional}
          onChange={(e) =>
            setFormData({ ...formData, additional: e.target.value })
          }
        />
      </FormControl>

      <FormControl as={GridItem} mt="2%">
        <FormLabel
          htmlFor="appointment"
          fontWeight="normal"
          color="gray.700"
          _dark={{
            color: "gray.50",
          }}
        >
          {t("time")}
        </FormLabel>
        <div>
          <DateTimePicker
            minDate={new Date()}
            tileDisabled={(tile) => isDisabledDate(tile.date)}
            onChange={(v) => {
              setFormData({ ...formData, appointment: v as Date });
            }}
            value={formData.appointment}
          />
        </div>
      </FormControl>
    </>
  );
};

export default function Create() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(33.33);

  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    hospitalCity: "",
    hospitalCountry: "",
    hospitalStreet: "",
    patientCity: "",
    patientCountry: "",
    patientStreet: "",
    services: [],
    additional: "",
    appointment: new Date(),
  });

  const { authUser } = useAuth();

  const router = useRouter();

  const isDisabled = Boolean(
    formData.firstName === "" ||
      formData.lastName === "" ||
      formData.phone === "" ||
      formData.hospitalCity === "" ||
      formData.hospitalCountry === "" ||
      formData.hospitalStreet === "" ||
      formData.patientCity === "" ||
      formData.patientCountry === "" ||
      formData.patientStreet === "" ||
      formData.services.length === 0
  );

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="bold" mb="5%" mt="5%">
        {t("create_request")}
      </Heading>
      <Box
        borderWidth="1px"
        rounded="lg"
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
        maxWidth={800}
        p={6}
        m="10px auto"
        as="form"
      >
        <Progress
          hasStripe
          value={progress}
          mb="5%"
          mx="5%"
          isAnimated
        ></Progress>
        {step === 1 ? (
          <Form1 formData={formData} setFormData={setFormData} />
        ) : (
          <Form2 formData={formData} setFormData={setFormData} />
        )}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={() => {
                  setStep(step - 1);
                  setProgress(progress - 33.33);
                }}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="ghost"
                w="7rem"
                mr="5%"
              >
                {t("back")}
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 2}
                onClick={() => {
                  setStep(step + 1);
                  if (step === 2) {
                    setProgress(100);
                  } else {
                    setProgress(progress + 33.33);
                  }
                }}
                colorScheme="teal"
                variant="outline"
              >
                {t("next")}
              </Button>
            </Flex>
            {step === 2 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="ghost"
                isDisabled={isDisabled}
                onClick={async () => {
                  if (!authUser) return;

                  try {
                    await createRequest({
                      appointment: formData.appointment,
                      additional: formData.additional,
                      hospitalCity: formData.hospitalCity,
                      hospitalCountry: formData.hospitalCountry,
                      hospitalStreet: formData.hospitalStreet,
                      patientCity: formData.patientCity,
                      patientCountry: formData.patientCountry,
                      patientStreet: formData.patientStreet,
                      serviceIds: formData.services.map((s) => s.id),
                      patientFirstName: formData.firstName,
                      patientLastName: formData.lastName,
                      patientPhone: formData.phone,
                      patientId: authUser.id || "",
                      createdAt: new Date(),
                      response: "",
                      canceled: false,
                    });

                    if (authUser.email) {
                      await createEmail({
                        to: authUser.email,
                        message: {
                          subject: t("created_request"),
                          html:
                            t("create_request_success", {
                              services: `услуг${
                                formData.services.length > 1 ? "и" : "а"
                              } ${formData.services
                                .map((s) => s.title)
                                .join(", ")}`,
                            }) +
                            '- <a href="https://medictrans-oncall.com">https://medictrans-oncall.com</a>',
                          text:
                            t("create_request_success", {
                              services: `услуг${
                                formData.services.length > 1 ? "и" : "а"
                              } ${formData.services
                                .map((s) => s.title)
                                .join(", ")}`,
                            }) + `- https://medictrans-oncall.com`,
                        },
                      });
                    }

                    toast({
                      title: t("sent_request"),
                      description: t("we_will_contact_you"),
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                    setFormData({
                      firstName: "",
                      lastName: "",
                      phone: "",
                      services: [],
                      appointment: new Date(),
                      additional: "",
                      hospitalCity: "",
                      hospitalCountry: "",
                      hospitalStreet: "",
                      patientCity: "",
                      patientCountry: "",
                      patientStreet: "",
                    });
                    router.push("/home", undefined, { locale: i18n.language });
                  } catch (e) {
                    console.error(e);
                    toast({
                      title: t("send_request_fail"),
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
            ) : null}
          </Flex>
        </ButtonGroup>
      </Box>
    </>
  );
}
