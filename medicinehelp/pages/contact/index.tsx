import { createEmail, createQuestion, createRequest } from "@/api";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  Stack,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from "next-i18next";

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export default function ContactFormWithSocialButtons() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const toast = useToast();

  const { t } = useTranslation();

  const router = useRouter();

  const isDisabled =
    name === "" || email === "" || message === "" || !expression.test(email);

  return (
    <Flex align="center" justify="center" id="contact">
      <Box
        borderRadius="lg"
        m={{ base: 5, md: 16, lg: 10 }}
        p={{ base: 5, lg: 16 }}
      >
        <Box>
          <VStack spacing={{ base: 4, md: 8, lg: 20 }}>
            <Heading
              fontSize={{
                base: "4xl",
                md: "5xl",
              }}
            >
              {t('contact_us')}
            </Heading>

            <Stack
              spacing={{ base: 4, md: 8, lg: 20 }}
              direction={{ base: "column", md: "row" }}
            >
              <Box
                bg={useColorModeValue("white", "gray.700")}
                borderRadius="lg"
                p={8}
                color={useColorModeValue("gray.700", "whiteAlpha.900")}
                shadow="base"
                width={{ base: "full", md: "xl" }}
              >
                <VStack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel>{t('name')}</FormLabel>

                    <InputGroup>
                      <Input
                        type="text"
                        name="name"
                        placeholder={t('your_first_and_last_name') || ''}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('email')}</FormLabel>

                    <InputGroup>
                      <Input
                        type="email"
                        name="email"
                        placeholder={t('your_email') || ''}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('phone_number')}</FormLabel>

                    <InputGroup>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        placeholder={t('your_phone') || ''}
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value;

                          const regex = /^[0-9+]+$/;

                          if (regex.test(value) || !value) {
                            setPhone(e.target.value);
                          }
                        }}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>{t('message')}</FormLabel>

                    <Textarea
                      name="message"
                      placeholder={t('your_message') || ''}
                      rows={6}
                      resize="none"
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </FormControl>

                  <Button
                    colorScheme="blue"
                    bg="blue.400"
                    color="white"
                    _hover={{
                      bg: "blue.500",
                    }}
                    isDisabled={isDisabled}
                    onClick={async () => {
                      try {
                        await createQuestion({
                          createdAt: new Date(),
                          creatorEmail: email,
                          creatorName: name,
                          creatorPhone: phone,
                          message,
                        });

                        await createEmail({
                          to: email,
                          message: {
                            subject: `${t('question_from')} ${name}`,
                            html: message,
                            text: message,
                          },
                        });

                        toast({
                          title: t('send_question_success'),
                          description: t('we_will_contact_you'),
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                        });
                      } catch (e) {
                        toast({
                          title: t('send_question_fail'),
                          description: t('please_try_again'),
                          status: "error",
                          duration: 5000,
                          isClosable: true,
                        });
                      } finally {
                        setName("");
                        setEmail("");
                        setMessage("");
                      }
                    }}
                  >
                    {t('send')}
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </VStack>
        </Box>
      </Box>
    </Flex>
  );
}
