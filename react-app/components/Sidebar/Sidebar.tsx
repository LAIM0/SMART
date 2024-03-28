/* eslint-disable */
import React from "react";
import { Flex, Image, Text } from "@chakra-ui/react";
import logoApp from "./Ecoexya.png";
import { useGlobalState } from "./../../contexts/Context";
import { useEffect, useState } from "react";

interface Pages {
  name: string;
  path: string;
}

const Pages = [
  {
    name: "Classement",
    path: "M8.83743 1.23767L8.30768 0.706761L8.83743 1.23767C9.02171 1.05379 9.27201 0.950195 9.53333 0.950195H16.4667C16.728 0.950195 16.9783 1.05379 17.1626 1.23767C17.3468 1.4215 17.45 1.67047 17.45 1.92972V23.6635H8.55V1.92972C8.55 1.67047 8.6532 1.4215 8.83743 1.23767ZM20.6833 23.6635V9.59781H24.2667C24.528 9.59781 24.7783 9.70141 24.9626 9.88529C25.1468 10.0691 25.25 10.3181 25.25 10.5773V23.1164C25.25 23.261 25.1925 23.4 25.0895 23.5027C24.9865 23.6055 24.8464 23.6635 24.7 23.6635H20.6833ZM1.03743 6.42625C1.22171 6.24237 1.47201 6.13877 1.73333 6.13877H5.31667V23.6635H1.3C1.1536 23.6635 1.01353 23.6055 0.910507 23.5027C0.807545 23.4 0.75 23.261 0.75 23.1164V7.11829C0.75 6.85904 0.853199 6.61007 1.03743 6.42625Z"
  },
  {
    name: "Defis",
    path: "M18.788 8.87286L18.6229 8.58474L14.8195 1.94739C14.8195 1.94735 14.8195 1.94732 14.8195 1.94729C14.7344 1.79888 14.6134 1.67726 14.4697 1.59334C14.3261 1.50946 14.1644 1.46582 14.0005 1.46582C13.8366 1.46582 13.6749 1.50946 13.5313 1.59334C13.3877 1.67726 13.2667 1.79888 13.1816 1.94729C13.1815 1.94732 13.1815 1.94735 13.1815 1.94739L9.37808 8.58474L9.21297 8.87286L8.88866 8.94429L1.50216 10.5711C1.34157 10.6065 1.19162 10.6844 1.06771 10.7983C0.943705 10.9122 0.850086 11.0585 0.797557 11.223C0.74501 11.3876 0.735785 11.5637 0.770994 11.7333C0.806196 11.9029 0.884309 12.0589 0.996243 12.1861L0.996443 12.1863L6.03146 17.9135L6.24685 18.1585L6.21449 18.4831L5.45243 26.1263L5.45242 26.1264C5.43517 26.2992 5.46286 26.4731 5.53219 26.6306C5.60148 26.7881 5.70952 26.9228 5.8442 27.0223C5.97878 27.1217 6.13554 27.1827 6.29868 27.2004C6.4618 27.2181 6.62697 27.1921 6.77802 27.1244L6.77816 27.1244L13.6938 24.0256L14.0005 23.8882L14.3072 24.0256L21.2229 27.1244L21.223 27.1244C21.374 27.1921 21.5392 27.2181 21.7023 27.2004C21.8655 27.1827 22.0222 27.1217 22.1568 27.0223C22.2915 26.9228 22.3995 26.7881 22.4688 26.6306C22.5382 26.4731 22.5659 26.2992 22.5486 26.1264L22.5486 26.1263L21.7865 18.4831L21.7542 18.1586L21.9695 17.9136L27.0043 12.1852C27.0044 12.1852 27.0045 12.1851 27.0045 12.185C27.1162 12.0578 27.194 11.902 27.2291 11.7326C27.2642 11.563 27.2549 11.3871 27.2024 11.2226L27.9168 10.9944L27.2024 11.2226C27.1499 11.0582 27.0563 10.9121 26.9325 10.7982C26.8088 10.6844 26.6591 10.6066 26.4989 10.5711L18.788 8.87286ZM18.788 8.87286L19.1124 8.94429L26.4984 10.571L18.788 8.87286Z"
  },
  {
    name: "Profil",
    path: "M3.444 16.8802H3.44091C3.09127 16.8788 2.74425 16.9484 2.41956 17.0857C2.09481 17.223 1.79811 17.4256 1.54707 17.683C1.29598 17.9405 1.09556 18.2476 0.95837 18.5874C0.821206 18.9272 0.750222 19.2922 0.75 19.6613L3.444 16.8802ZM3.444 16.8802H20.5714C21.2746 16.8802 21.9536 17.1677 22.4577 17.6869C22.9626 18.2069 23.25 18.9167 23.25 19.6613C23.25 22.3684 21.9701 24.3977 19.9284 25.7382C17.8908 27.0755 15.0867 27.7391 12 27.7391C8.91321 27.7391 6.10914 27.0755 4.07153 25.7382M3.444 16.8802L4.07153 25.7382M4.07153 25.7382C2.0295 24.3957 0.750113 22.3699 0.75 19.6617L4.07153 25.7382ZM7.68935 2.83117C8.83648 1.64973 10.3875 0.990234 12 0.990234C13.6125 0.990234 15.1635 1.64973 16.3106 2.83117C17.4585 4.01336 18.1071 5.62134 18.1071 7.30246C18.1071 8.98358 17.4585 10.5916 16.3106 11.7737C15.1635 12.9552 13.6125 13.6147 12 13.6147C10.3875 13.6147 8.83648 12.9552 7.68935 11.7737C6.54149 10.5916 5.89286 8.98358 5.89286 7.30246C5.89286 5.62134 6.54149 4.01336 7.68935 2.83117Z"
  }
];

interface IconNavbarProps {
  d: string | undefined;
  fill: string;
}

const IconNavbar: React.FC<IconNavbarProps> = ({ d, fill }) => {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 28 28"
      stroke="#166879"
      stroke-width="1.5"
    >
      <path d={d} fill={fill} />
    </svg>
  );
};

interface FindPageByNameProps {
  pageName: string;
}

const findPageByName = ({
  pageName
}: FindPageByNameProps): Pages | undefined => {
  return Pages.find((page: Pages) => page.name === pageName);
};

const Sidebar = () => {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); // Appel initial pour définir la largeur de la fenêtre
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //const { globalState, setGlobalState } = useGlobalState();

  return (
    <Flex
      zIndex={10}
      bg="white"
      color="grey.800"
      p={4}
      gap={4}
      flexDirection={windowWidth < 500 ? "row" : "column"}
      w={windowWidth < 500 ? "100%" : "250px"}
      h={windowWidth < 500 ? "120px" : "100vh"}
      position="fixed"
      left="0"
      top={windowWidth < 500 ? "auto" : "0"}
      boxShadow="xl"
      bottom={windowWidth < 500 ? "0" : "auto"}
    >
      {windowWidth > 500 && (
        <Image src={logoApp.src} w="160px" alt="logo" m={4} />
      )}
      {Pages.map((page, index) => (
        <Flex
          flex={windowWidth < 500 ? 1 : 0}
          flexDirection={windowWidth < 500 ? "column" : "row"}
          key={index}
          py="4"
          px="6"
          gap="16px"
          borderRadius="md"
          alignItems="center"
          fontSize={windowWidth < 500 ? "12px" : "auto"}
          //color={page.name === globalState ? "white" : "grey.800"}
          //fontWeight={page.name === globalState ? "bold" : "light"}
          _hover={{
            //bg: page.name === globalState ? "primary.100" : "#F1F1F1",
            cursor: "pointer"
          }}
          //bg={page.name === globalState ? "primary.100" : "auto"}
          //onClick={() => setGlobalState(page.name)}
          transition="background 0.3s ease, fontWeight 0.8s ease"
        >
          <IconNavbar
            d={findPageByName({ pageName: page.name })?.path}
            fill={page.name === "test" ? "#166879" : "transparent"}
            //transition="fill 0.3s ease, stroke 0.3s ease"
          ></IconNavbar>
          <Text
            color="primary.300"
            //fontWeight={page.name === globalState ? "bold" : "light"}
            lineHeight={1}
            fontSize={windowWidth < 500 ? "12px" : "16px"}
          >
            {page.name}
          </Text>
        </Flex>
      ))}
    </Flex>
  );
};

export default Sidebar;
