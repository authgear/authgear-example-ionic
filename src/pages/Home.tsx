import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Capacitor } from "@capacitor/core";
import type { MouseEvent } from "react";
import authgearWeb, {
  SessionState,
  WebContainer,
  SessionStateChangeReason,
} from "@authgear/web";
import authgearCapacitor, {
  CapacitorContainer,
  Page,
} from "@authgear/capacitor";
import "./Home.css";

const CLIENT_ID = import.meta.env.VITE_AUTHGEAR_CLIENT_ID;
const ENDPOINT = import.meta.env.VITE_AUTHGEAR_ENDPOINT;
const REDIRECT_URI_WEB_AUTHENTICATE = import.meta.env.VITE_AUTHGEAR_REDIRECT_URI_WEB;
const REDIRECT_URI_CAPACITOR = import.meta.env.VITE_AUTHGEAR_REDIRECT_URI_CAPACITOR;

function isPlatformWeb(): boolean {
  return Capacitor.getPlatform() === "web";
  
}

function AuthenticationScreen() {
  const [sessionState, setSessionState] = useState<SessionState | null>(() => {
    if (isPlatformWeb()) {
      return authgearWeb.sessionState;
    }
    return authgearCapacitor.sessionState;
  });

  const loggedIn = sessionState === "AUTHENTICATED";
  const delegate = useMemo(() => {
    const d = {
      onSessionStateChange: (
        container: WebContainer | CapacitorContainer,
        _reason: SessionStateChangeReason
      ) => {
        setSessionState(container.sessionState);
      },
    };
    return d;
  }, [setSessionState]);

  useEffect(() => {
    if (isPlatformWeb()) {
      authgearWeb.delegate = delegate;
    } else {
      authgearCapacitor.delegate = delegate;
    }

    return () => {
      if (isPlatformWeb()) {
        authgearWeb.delegate = undefined;
      } else {
        authgearCapacitor.delegate = undefined;
      }
    };
  }, [delegate]);

  const configure = useCallback(async () => {
    try {
      if (isPlatformWeb()) {
        await authgearWeb.configure({
          clientID: CLIENT_ID,
          endpoint: ENDPOINT,
          sessionType: "refresh_token",
          isSSOEnabled: false,
        });
      } else {
        await authgearCapacitor.configure({
          clientID: CLIENT_ID,
          endpoint: ENDPOINT,
        });
      }
      await postConfigure();
    } catch (e) {
      setSessionState(SessionState.Unknown); //prevent use of old session state when a configuration error occurs. 
      console.error("Authgear Configuration error:", e);
    } 
  }, [CLIENT_ID, ENDPOINT]);

  const postConfigure = useCallback(async () => {
    const sessionState = isPlatformWeb()
      ? authgearWeb.sessionState
      : authgearCapacitor.sessionState;

    // if user has an existing session, call SDK fetchUserInfo method to get the user's info and refresh access token when necessary
    if (sessionState === "AUTHENTICATED") {
      if (isPlatformWeb()) {
        await authgearWeb.fetchUserInfo();
      } else {
        await authgearCapacitor.fetchUserInfo();
      }
    }
  }, []);

  useEffect(() => {
    configure();
  }, []);

  const authenticate = useCallback(async (page: string) => {
    try {
      if (isPlatformWeb()) {
        authgearWeb.startAuthentication({
          redirectURI: REDIRECT_URI_WEB_AUTHENTICATE,
          page: page,
        });
      } else {
        const result = await authgearCapacitor.authenticate({
          redirectURI: REDIRECT_URI_CAPACITOR,
          page: page,
        });
      }
    } catch (e) {
      console.error("Authentication error:", e);
    } 
  }, []);

  const logout = useCallback(async () => {
    try {
      if (isPlatformWeb()) {
        await authgearWeb.logout({
          redirectURI: window.location.origin + "/",
        });
      } else {
        await authgearCapacitor.logout();
      }
    } catch (e) {
      console.error("Logout error:", e);
    } 
  }, []);

  const fetchUserInfo = useCallback(async () => {
    try {
      const authgear = isPlatformWeb() ? authgearWeb : authgearCapacitor;
      const userInfo = await authgear.fetchUserInfo();
      alert(JSON.stringify(userInfo, null, 2)); // Keep for demonstration, but consider a better way to display info
    } catch (e) {
      console.error("FetchUserInfo error:", e);
    } 
  }, []);

  const openUserSettings = useCallback(async () => {
    try {
      if (isPlatformWeb()) {
        authgearWeb.open(Page.Settings);
      } else {
        authgearCapacitor.open(Page.Settings);
      }
    } catch (e) {
      console.error("Error:", e)
    } 
  }, []);

  const onClickAuthenticate = useCallback(
    (e: MouseEvent<HTMLIonButtonElement>, page: string) => {
      e.preventDefault();
      e.stopPropagation();

      authenticate(page);
    },
    [authenticate]
  );

  const onClickLogout = useCallback(
    (e: MouseEvent<HTMLIonButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      logout();
    },
    [logout]
  );

  const onClickFetchUserInfo = useCallback(
    (e: MouseEvent<HTMLIonButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      fetchUserInfo();
    },
    [fetchUserInfo]
  );

  const onClickUserSettings = useCallback(
    (e: MouseEvent<HTMLIonButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      openUserSettings();
    },
    [logout]
  );

  return (
    <>
      <div className="container">
        <h1>Welcome</h1>
        {!loggedIn ? (
          <IonButton
            className="button"
            onClick={(event) => {
              onClickAuthenticate(event, "login");
            }}
          >
            Login
          </IonButton>
        ) : (
          <div>
            <p>Welcome user</p>

            <IonButton className="button" onClick={onClickFetchUserInfo}>
              Fetch User Info
            </IonButton>

            <IonButton
              className="button"
              onClick={onClickUserSettings}
            >
              User Settings
            </IonButton>

            <IonButton className="button" onClick={onClickLogout}>
              Logout
            </IonButton>
          </div>
        )}
      </div>
    </>
  );
}
const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AuthenticationScreen />
      </IonContent>
    </IonPage>
  );
};

export default Home;
