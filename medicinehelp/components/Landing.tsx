import {
  Box,
  Center,
  Container,
  Wrap,
  WrapItem,
  Text,
  VStack,
  SimpleGrid,
  Heading,
  Image,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
// import { FAQSection } from "../../components/FAQSection";
import { Feature } from "./Feature";
import { HeroSection } from "./HeroSection";
import { Layout } from "./Layout";
// import { PricingSection } from "../../components/PricingSection";
import { Helmet } from "react-helmet";
import { getServices } from "@/api";
import { useEffect, useState } from "react";
import { Locale, Service } from "@/models";
import { useTranslation } from "next-i18next";

export interface HighlightType {
  icon: string;
  title: string;
  description: string;
}

const highlights: HighlightType[] = [
  {
    icon: "✨",
    title: "No-code",
    description:
      "We are No-Code friendly. There is no coding required to get started. Launchman connects with Airtable and lets you generate a new page per row. It's just that easy!",
  },
  {
    icon: "🎉",
    title: "Make Google happy",
    description:
      "We render all our pages server-side; when Google's robots come to index your site, the page does not have to wait for JS to be fetched. This helps you get ranked higher.",
  },
  {
    icon: "😃",
    title: "Rapid experimenting",
    description:
      "You don't have to wait hours to update your hard-coded landing pages. Figure out what resonates with your customers the most and update the copy in seconds",
  },
  {
    icon: "🔌",
    title: "Rapid experimenting",
    description:
      "You don't have to wait hours to update your hard-coded landing pages. Figure out what resonates with your customers the most and update the copy in seconds",
  },
];

interface FeatureType {
  title: string;
  description: string;
}

export default function Landing() {
  const { t, i18n } = useTranslation("common");

  const [services, setServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    const data = await getServices(i18n.language as Locale);
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, [i18n.language]);

  const features: FeatureType[] = [
    {
      title: t("highly_qualified_teams_title"),
      description: t("highly_qualified_teams_description"),
    },
    {
      title: t("medical_insurance_title"),
      description: t("medical_insurance_description"),
    },
    {
      title: t("on_site_manipulations_title"),
      description: t("on_site_manipulations_description"),
    },
  ];

  return (
    <Layout>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Medic Trans</title>
      </Helmet>
      <Box bg="white" paddingBottom={20}>
        <HeroSection />
        <VStack backgroundColor="white" w="full">
          {features.map(({ title, description }: FeatureType, i: number) => {
            return (
              <Feature
                key={`feature_${i}`}
                title={title}
                description={description}
              />
            );
          })}
        </VStack>
      </Box>
    </Layout>
  );
}
