import { Spinner } from "@chakra-ui/react";
import { useAuth } from "@/context/auth-context";
import Landing from "@/components/Landing";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}

export default function Root() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Spinner
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        size="xl"
      />
    );
  }

  return <Landing />;
}
