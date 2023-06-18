import { useAuth } from "@/context/auth-context";
import {
  Button,
  Center,
  Container,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import { useTranslation } from "next-i18next";
import { Carousel } from "./Carousel";
import { Flex } from "@chakra-ui/react";

interface HeroSectionProps {}

const imagePaths = [
  "/home1.png",
  "/home2.png",
  "/home3.png",
  "/home4.png",
  "/home5.png",
];

export const HeroSection: FunctionComponent<HeroSectionProps> = () => {
  const { t, i18n } = useTranslation();

  const router = useRouter();

  const { authUser, loading } = useAuth();

  const isLoggedOut = !loading && !authUser;

  return (
    <Container maxW="container.xl">
      <Center p={4}>
        <VStack>
          <Container maxW="container.md" textAlign="center">
            <Heading size="2xl" mb={4} color="gray.700">
              {t('landing_title')}
            </Heading>

            <Text fontSize="xl" color="gray.500" mt="5%" mb="5%">
              {t('landing_description')}
            </Text>
            <Carousel imagePaths={imagePaths} />
            {isLoggedOut && (
              <>
                <Button
                  size="lg"
                  bg={"red.400"}
                  color={"white"}
                  _hover={{
                    bg: "red.500",
                  }}
                  mt="5%"
                  mb="5%"
                  onClick={() => {
                    router.push("/signup", undefined, { locale: i18n.language });
                  }}
                >
                  {t('sign_up')}
                </Button>
                <Button
                  size="lg"
                  bg={"red.400"}
                  color={"white"}
                  _hover={{
                    bg: "red.500",
                  }}
                  mt="5%"
                  mb="5%"
                  marginLeft={[0,20]}
                  onClick={() => {
                    router.push("/login", undefined, { locale: i18n.language });
                  }}
                >
                  {t('sign_in')}
                </Button>
              </>
            )}
          </Container>
        </VStack>
      </Center>
    </Container>
  );
};
