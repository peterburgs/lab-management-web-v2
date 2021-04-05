import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Sidebar from "../components/layout/Sidebar";
import TopNavBar from "../components/layout/TopNavBar";
import styled, { css } from "styled-components";
import { Close } from "@material-ui/icons";
import { Snackbar, Alert, Slide } from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../store";
import {
  setShowSuccessSnackBar,
  setShowErrorSnackBar,
} from "../reducers/notificationSlice";
import { TransitionProps } from "@material-ui/core/transitions";

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

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
  const dispatch = useAppDispatch();
  const prevWindowWidth = useRef(window.innerWidth);
  const [isShowNotifyPanel, setIsShowNotifyPanel] = useState(false);
  const [isShowAvatarPanel, setIsShowAvatarPanel] = useState(false);

  const showSuccessSnackBar = useAppSelector(
    (state) => state.notifications.showSuccessSnackBar
  );
  const showErrorSnackBar = useAppSelector(
    (state) => state.notifications.showErrorSnackBar
  );
  const snackBarContent = useAppSelector(
    (state) => state.notifications.snackBarContent
  );

  const handleSidebarToggleOnWindowResize = useCallback(() => {
    if (window.innerWidth > 1220) {
      setCollapsed(false);
      prevWindowWidth.current = window.innerWidth;
    } else if (prevWindowWidth.current > 1220) {
      setCollapsed(true);
      prevWindowWidth.current = window.innerWidth;
    }
  }, [setCollapsed]);

  useEffect(() => {
    window.addEventListener(
      "resize",
      handleSidebarToggleOnWindowResize
    );
  }, [handleSidebarToggleOnWindowResize, setCollapsed]);

  const handleClosePanel = () => {
    setIsShowAvatarPanel(false);
    setIsShowNotifyPanel(false);
  };

  const handleCloseSnackBar = () => {
    dispatch(setShowSuccessSnackBar(false));
    dispatch(setShowErrorSnackBar(false));
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={showSuccessSnackBar}
        autoHideDuration={4000}
        onClose={handleCloseSnackBar}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleCloseSnackBar} severity="success">
          {snackBarContent}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        open={showErrorSnackBar}
        autoHideDuration={4000}
        onClose={handleCloseSnackBar}
        TransitionComponent={SlideTransition}
      >
        <Alert onClose={handleCloseSnackBar} severity="warning">
          {snackBarContent}
        </Alert>
      </Snackbar>
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
    </>
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

  @media (max-width: 1220px) {
    position: relative;
    grid-template-areas:
      "sidebar topNav"
      "sidebar content";
  }
`;

interface SidebarContainerProps {
  isCollapsed: boolean;
}
const SidebarContainer = styled.div<SidebarContainerProps>`
  grid-area: sidebar;
  width: 67px;
  height: 100vh;
  transition: width 0.3s ease-in-out;
  z-index: 4;
  ${({ isCollapsed }) =>
    !isCollapsed &&
    css`
      width: 240px;
    `}
`;

const TopNavContainer = styled.div`
  padding: 24px 20px;

  @media (min-width: 1220px) {
    grid-area: "topNav";
  }

  @media (max-width: 1220px) {
    position: absolute;
    width: calc(100vw - 67px);
    left: 67px;
    top: 0px;
  }
`;

interface ContentContainerProps {
  isCollapsed: boolean;
}

const ContentContainer = styled.div<ContentContainerProps>`
  padding: 0px 24px;
  /* The content section must have width and height so that its children can be scrolled */
  height: calc(100vh - 92px);
  width: calc(100vw - 240px);

  @media (min-width: 1220px) {
    grid-area: "content";
  }

  @media (max-width: 1220px) {
    position: absolute;
    width: calc(100vw - 67px);
    left: 67px;
    top: 80px;
  }
`;

export default Layout;
