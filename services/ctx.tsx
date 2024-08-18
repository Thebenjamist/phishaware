import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import {
  useContext,
  createContext,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

async function saveSession(key: string, value: string) {
  const chunkSize = 2048;
  const numChunks = Math.ceil(value.length / chunkSize);
  for (let i = 0; i < numChunks; i++) {
    const chunk = value.slice(i * chunkSize, (i + 1) * chunkSize);
    await SecureStore.setItemAsync(`${key}_chunk${i}`, chunk);
  }
  await SecureStore.setItemAsync(`${key}_numChunks`, numChunks.toString());
}

async function getSession(key: string) {
  const numChunks = parseInt(
    (await SecureStore.getItemAsync(`${key}_numChunks`)) || "0"
  );
  let value = "";
  for (let i = 0; i < numChunks; i++) {
    const chunk = await SecureStore.getItemAsync(`${key}_chunk${i}`);
    value += chunk;
  }
  return value;
}

function isSessionValid(session: string | null): boolean {
  console.info("Checking for valid session");
  if (!session) return false;
  const { idToken } = JSON.parse(session);
  const jwtPayload = JSON.parse(atob(idToken.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  const { exp } = jwtPayload;
  const timeLeft = exp - currentTime;
  console.log(
    "Time left for valid session:",
    Math.floor(timeLeft / 60),
    "minutes",
    timeLeft % 60,
    "seconds"
  );
  return jwtPayload.exp > currentTime;
}

async function refreshSession(session: string | null): Promise<string | null> {
  console.log("Refreshing session");
  if (!session) return null;
  const sessionData = JSON.parse(session);

  const { refreshToken } = sessionData;
  const userPool = new CognitoUserPool({
    UserPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID!,
    ClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID!,
  });
  const user = new CognitoUser({ Username: "", Pool: userPool });
  const cognitoRefreshToken = new CognitoRefreshToken({
    RefreshToken: refreshToken,
  });

  console.log("Refreshing session with token:", cognitoRefreshToken);

  return new Promise<string | null>((resolve, reject) => {
    user.refreshSession(cognitoRefreshToken, (err, session) => {
      if (err) {
        console.log("Error refreshing session", err);
        reject(null);
      } else {
        console.log("Session refreshed");
        const idToken = session.getIdToken().getJwtToken();
        const accessToken = session.getAccessToken().getJwtToken();
        const newSessionData = JSON.stringify({
          idToken,
          accessToken,
          refreshToken: cognitoRefreshToken.getToken(),
        });
        console.log("New session data:", newSessionData);
        saveSession("session", newSessionData).then(() => {
          resolve(newSessionData);
        });
      }
    });
  });
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      let storedSession = await getSession("session");
      if (storedSession && !isSessionValid(storedSession)) {
        storedSession = (await refreshSession(storedSession)) as string;
      }
      if (storedSession) {
        setSession(storedSession);
      } else {
        setSession(null);
        router.push("/welcome");
      }
      setIsLoading(false);
    })();
  }, []);

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    const userPool = new CognitoUserPool({
      UserPoolId: process.env.EXPO_PUBLIC_USER_POOL_ID!,
      ClientId: process.env.EXPO_PUBLIC_USER_POOL_CLIENT_ID!,
    });
    const user = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    return new Promise<void>((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: async (result) => {
          const idToken = result.getIdToken().getJwtToken();
          const accessToken = result.getAccessToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();
          const sessionData = JSON.stringify({
            idToken,
            accessToken,
            refreshToken,
          });
          await saveSession("session", sessionData);
          setSession(sessionData);
          setIsLoading(false);
          resolve();
        },
        onFailure: (err) => {
          setIsLoading(false);
          reject(err);
        },
      });
    });
  };

  const signOut = async () => {
    await SecureStore.deleteItemAsync("session_numChunks");
    let i = 0;
    while (await SecureStore.getItemAsync(`session_chunk${i}`)) {
      await SecureStore.deleteItemAsync(`session_chunk${i}`);
      i++;
    }
    setSession(null);
    router.push("/welcome");
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
