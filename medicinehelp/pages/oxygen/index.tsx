import { Carousel } from "@/components/Carousel";
import { Heading, Text } from "@chakra-ui/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const imagePaths = [
  "/oxygen1.png",
  "/oxygen3.png",
  "/oxygen4.png",
  "/oxygen5.png",
  "/oxygen6.png",
];

export default function Oxygen() {
  const { t } = useTranslation();

  return (
    <>
      <Heading w="100%" textAlign={"center"} fontWeight="bold" mb="5%" mt="5%">
        {t("oxygen")}
      </Heading>
      <Text mb="5%" mt="5%" fontSize={25} textAlign="center" fontWeight="bold">
        {t("contact_us_for_info")}
      </Text>
      <Carousel imagePaths={imagePaths} />
    </>
  );
}
