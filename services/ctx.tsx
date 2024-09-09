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
import { useRouter, useSegments } from "expo-router";
import api from "./api";
import { getSession, saveSession } from "./secretStorage";

export type User = {
  id: string;
  email: string;
  firstTimeOpen: boolean;
};

const AuthContext = createContext<{
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  user: User | null;
  fetchUser: () => Promise<void>;
}>({
  signIn: async () => {},
  signOut: () => null,
  session: null,
  isLoading: false,
  user: null,
  fetchUser: async () => {},
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

function isSessionValid(session: string | null): boolean {
  if (!session) return false;
  const { idToken } = JSON.parse(session);
  const jwtPayload = JSON.parse(atob(idToken.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  const { exp } = jwtPayload;

  return jwtPayload.exp > currentTime;
}

async function refreshSession(session: string | null): Promise<string | null> {
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

  return new Promise<string | null>((resolve, reject) => {
    user.refreshSession(cognitoRefreshToken, (err, session) => {
      if (err) {
        resolve(null);
      } else {
        const idToken = session.getIdToken().getJwtToken();
        const accessToken = session.getAccessToken().getJwtToken();
        const newSessionData = JSON.stringify({
          idToken,
          accessToken,
          refreshToken: cognitoRefreshToken.getToken(),
        });
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
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const data = await api("/profile", "GET")
      .then((res) => {
        setUser(res.data);
        return res;
      })
      .catch(console.error);
  };
  useEffect(() => {
    (async () => {
      let storedSession = await getSession("session");
      if (storedSession && !isSessionValid(storedSession)) {
        storedSession = (await refreshSession(storedSession)) as string;
      }
      if (storedSession) {
        setSession(storedSession);
        scheduleRefresh(storedSession);
        if (!user) {
          await fetchUser();
        }
      } else {
        signOut();
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
          await fetchUser();
          setSession(sessionData);
          scheduleRefresh(sessionData);
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
    setUser(null);
    router.push("/welcome");
  };

  const scheduleRefresh = (session: string) => {
    const { idToken } = JSON.parse(session);
    const jwtPayload = JSON.parse(atob(idToken.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    const { exp } = jwtPayload;
    const timer = exp - currentTime - 5 * 60;
    setTimeout(async () => {
      setIsLoading(true);
      const newSession = (await refreshSession(session)) as string;
      if (!newSession) {
        signOut();
        setIsLoading(false);
        return;
      }
      setSession(newSession);
      setIsLoading(false);
      scheduleRefresh(newSession);
    }, timer * 1000);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
        user,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
