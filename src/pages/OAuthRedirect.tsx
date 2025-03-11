import { useCallback, useEffect } from "react";
import authgearWeb from "@authgear/web";
import { useIonRouter } from "@ionic/react";

export default function OAuthRedirect() {
  const router = useIonRouter();

  const finishAuthentication = useCallback(async () => {
    const CLIENT_ID = import.meta.env.VITE_AUTHGEAR_CLIENT_ID;
    const ENDPOINT = import.meta.env.VITE_AUTHGEAR_ENDPOINT;

    try {
      await authgearWeb.configure({
        clientID: CLIENT_ID,
        endpoint: ENDPOINT,
        sessionType: "refresh_token",
      });
      await authgearWeb.finishAuthentication();
      router.push("/", "root", "replace");
    } catch (e) {
      console.error(e);
    }
  }, [router]);

  useEffect(() => {
    finishAuthentication();
  }, [finishAuthentication]);

  return (
    <div>
      Finishing authentication. Open the inspector to see if there is any error.
    </div>
  );
}