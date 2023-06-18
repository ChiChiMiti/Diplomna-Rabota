import React, { ReactNode } from "react";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  useColorModeValue,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Image,
  Button,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { logout } from "@/api";

const logo = "/logo.png";

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg="white">
      <SidebarContent
        onClose={() => onClose}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const { authUser, loading, signOut } = useAuth();

  const { t, i18n } = useTranslation();

  const router = useRouter();

  const isLoggedIn = !loading && authUser;

  const isAdmin = authUser?.role === "admin";

  const locale = i18n.language;

  const navLinks = [
    { name: t("home"), link: `/${locale}` },
    { name: t("services"), link: "/services" },
    { name: t("oxygen"), link: "/oxygen" },
    { name: t("about_us"), link: "/about-us" },
    { name: t("contacts"), link: "/contact" },
  ];

  const links = isLoggedIn
    ? [...navLinks, { name: t("requests"), link: isAdmin ? "/admin" : "/home" }]
    : navLinks;

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      w={{ base: "full", md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Image
          onClick={() => {
            router.push("/", undefined, { locale: i18n.language });
          }}
          style={{
            cursor: "pointer",
          }}
          src={logo}
          width={100}
          height={61}
          alt="Logo"
        />
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>
      {links.map((link) => (
        <NavItem href={link.link} key={link.name}>
          <Text fontWeight="bold" fontSize={20}>
            {link.name}
          </Text>
        </NavItem>
      ))}
      {isLoggedIn && (
        <NavItem href="/" key="Изход">
          <Text
            fontWeight="bold"
            fontSize={20}
            onClick={async () => {
              await signOut();
            }}
          >
            {t("logout")}
          </Text>
        </NavItem>
      )}
      <Flex direction="column">
        <Button
          margin={5}
          onClick={() => {
            router.push(
              {
                pathname: router.pathname,
                query: router.query,
              },
              undefined,
              { locale: "bg" }
            );
          }}
        >
          Български
        </Button>
        <Button
          margin={5}
          onClick={() => {
            router.push(
              {
                pathname: router.pathname,
                query: router.query,
              },
              undefined,
              { locale: "en" }
            );
          }}
        >
          English
        </Button>
      </Flex>
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  href: string;
  children: any;
}
const NavItem = ({ href, children, ...rest }: NavItemProps) => {
  const { i18n } = useTranslation();

  return (
    <Link href={href} style={{ textDecoration: "none" }} locale={i18n.language}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        {...rest}
      >
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  const router = useRouter();

  const { i18n } = useTranslation();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="space-between"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Image
        style={{
          cursor: "pointer",
        }}
        onClick={() => {
          router.push("/", undefined, { locale: i18n.language });
        }}
        src={logo}
        width={100}
        height={61}
        alt="Logo"
      />
    </Flex>
  );
};
