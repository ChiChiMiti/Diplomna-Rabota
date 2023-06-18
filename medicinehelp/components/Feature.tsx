import {
  Box,
  Button,
  Center,
  Container,
  Stack,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface FeatureProps {
  title: string;
  description: string;
  reverse?: boolean;
}

export const Feature: FunctionComponent<FeatureProps> = ({
  title,
  description,
}: FeatureProps) => {
  return (
    <Center w="full" paddingTop={10}>
      <Container maxW="container.xl" rounded="lg">
        <Stack
          spacing={[4, 16]}
          alignItems="center"
          direction={["column", null]}
          w="full"
          h="full"
        >
          <VStack maxW={500} spacing={4} align="center">
            <Box>
              <Text fontSize="3xl" fontWeight={600} align="center">
                {title}
              </Text>
            </Box>

            <Text fontSize="md" color="gray.500" align="center">
              {description}
            </Text>
          </VStack>
        </Stack>
      </Container>
    </Center>
  );
};
