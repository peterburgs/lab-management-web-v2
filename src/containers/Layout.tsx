import React, { ReactNode, useEffect, useRef, useState } from "react";
import Sidebar from "../components/Layout/Sidebar";
import TopNavBar from "../components/Layout/TopNavBar";
import styled, { css } from "styled-components";

interface LayoutProps {
  children: ReactNode;
  handleSidebarToggle: () => void;
  isCollapsed: boolean;
  setCollapsed: (a: boolean) => void;
}

const Layout = ({
  children,
  handleSidebarToggle,
  isCollapsed,
  setCollapsed,
}: LayoutProps) => {
  const prevWindowWidth = useRef(window.innerWidth);
  const [isShowNotifyPanel, setIsShowNotifyPanel] = useState(false);
  const [isShowAvatarPanel, setIsShowAvatarPanel] = useState(false);

  useEffect(() => {
    const handleSidebarToggleOnWindowResize = () => {
      if (window.innerWidth > 1220) {
        setCollapsed(false);
        prevWindowWidth.current = window.innerWidth;
      } else if (prevWindowWidth.current > 1220) {
        setCollapsed(true);
        prevWindowWidth.current = window.innerWidth;
      }
    };

    window.addEventListener(
      "resize",
      handleSidebarToggleOnWindowResize
    );
  }, [setCollapsed]);

  const handleClosePanel = () => {
    setIsShowAvatarPanel(false);
    setIsShowNotifyPanel(false);
  };

  return (
    <Container>
      <SidebarContainer
        isCollapsed={isCollapsed}
        onClick={handleClosePanel}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={handleSidebarToggle}
        />
      </SidebarContainer>
      <TopNavContainer>
        <TopNavBar
          handleClosePanel={handleClosePanel}
          isShowNotifyPanel={isShowNotifyPanel}
          isShowAvatarPanel={isShowAvatarPanel}
          setIsShowNotifyPanel={() => {
            setIsShowNotifyPanel((current) => !current);
            setIsShowAvatarPanel(false);
          }}
          setIsShowAvatarPanel={() => {
            setIsShowNotifyPanel(false);
            setIsShowAvatarPanel((current) => !current);
          }}
        />
      </TopNavContainer>
      <ContentContainer
        isCollapsed={isCollapsed}
        onClick={handleClosePanel}
      >
        {children}
      </ContentContainer>
    </Container>
  );
};

// Styling
const Container = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    "sidebar topNav"
    "sidebar content";
`;

interface SidebarContainerProps {
  isCollapsed: boolean;
}
const SidebarContainer = styled.div<SidebarContainerProps>`
  grid-area: sidebar;
  width: 240px;
  height: 100vh;
  transition: width 0.3s ease-in-out;
  ${({ isCollapsed }) =>
    isCollapsed &&
    css`
      width: 67px;
    `}
`;

const TopNavContainer = styled.div`
  grid-area: topNav;
  padding: 24px 20px;
`;

interface ContentContainerProps {
  isCollapsed: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  grid-area: content;
  padding: 0px 24px;
  /* The content section must have width and height so that its children can be scrolled */
  height: calc(100vh - 92px);
  width: ${({ isCollapsed }) =>
    isCollapsed ? "calc(100vw - 67px)" : "calc(100vw - 240px)"};
`;

export default Layout;
