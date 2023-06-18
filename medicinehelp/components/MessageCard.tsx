import { useAuth } from "@/context/auth-context";
import { User } from "@/models";
import { Message } from "@/models/message";
import { Flex, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useTranslation } from "next-i18next";

type Props = {
  message: Message;
  users: User[];
};

export const MessageCard = ({ message, users }: Props) => {
  const { authUser } = useAuth();

  const { t } = useTranslation();

  const sender = useMemo(
    () => users.find((u) => u.id === message.creatorId),
    [message.creatorId, users]
  );

  if (message.creatorId === authUser?.id) {
    return (
      <Flex w="100%" justify="flex-end">
        <Flex bg="black" color="white" my="1" p="3" borderRadius="base">
          <Text>{message.body}</Text>
        </Flex>
      </Flex>
    );
  } else {
    return (
      <Flex w="100%">
        <Flex bg="gray.100" color="black" my="1" p="3" borderRadius="base">
          <Text fontWeight="bold">{t('admin')}: &nbsp;</Text>
          <Text>{message.body}</Text>
        </Flex>
      </Flex>
    );
  }
};
