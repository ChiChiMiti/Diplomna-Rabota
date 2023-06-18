import { VStack, Heading, Box, Container, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function AboutUs() {
  const router = useRouter();

  const { t } = useTranslation();

  return (
    <Container py={28} maxW="container.md">
      <Box w="full">
        <VStack id="aboutus" spacing={10} w="full">
          <Heading>{t('about_us')}</Heading>
          <Text fontWeight={500} fontSize="2xl" align="center">
            {t('about_us_content')}
          </Text>
        </VStack>
      </Box>
    </Container>
  );
}
