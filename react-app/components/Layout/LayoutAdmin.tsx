/* eslint-disable */
import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import SidebarAdmin from "../Sidebar/SidebarAdmin";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps): JSX.Element {
  const [windowWidth, setWindowWidth] = useState<number>(0);

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

  return (
    <Flex>
      <SidebarAdmin />
      <Flex
        marginLeft={windowWidth < 500 ? "0px" : "250px"}
        p="32px"
        flexDirection="column"
        justifyContent="left"
        w="100%"
        h="auto"
        bg="#F8F8F8"
        display="inline"
      >
        {children}
        <div></div>
      </Flex>
    </Flex>
  );
}

export default Layout;
