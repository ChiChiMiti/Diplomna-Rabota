import { Box, Center, Divider, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Service, associateServiceWithImages, Locale } from "@/models";
import { getServices } from "@/api";
import { useRouter } from "next/router";
import { Carousel } from "@/components/Carousel";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);

  const { t, i18n } = useTranslation();

  const router = useRouter();

  const fetchServices = async () => {
    const data = await getServices(i18n.language as Locale);
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, [i18n.language]);

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="bold" mb="5%" mt="5%">
        {t("services")}
      </Heading>
      <Box>
        {services.map((service, i) => (
          <Box
            key={service.id || i}
            fontSize={"2xl"}
            fontFamily={"body"}
            mb="5%"
            paddingLeft={10}
            paddingRight={10}
          >
            <Center>
              <Text
                key={service.title}
                fontSize="3xl"
                fontWeight="bold"
                style={{
                  textAlign: "center",
                  display: "flex",
                  padding: 10,
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                {service.title}
              </Text>
            </Center>
            <Carousel imagePaths={associateServiceWithImages(service.title)} />
            <Text key={service.description}>{service.description}</Text>
            <Divider />
          </Box>
        ))}
      </Box>
    </>
  );
}
