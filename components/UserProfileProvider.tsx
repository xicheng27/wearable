"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { UserProfile } from "@/types";

type UserProfileContextValue = {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  hasCompletedQuiz: boolean;
};

const UserProfileContext = createContext<UserProfileContextValue | null>(null);
const storageKey = "xis-user-profile";

export default function UserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfileState] = useState<UserProfile>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        setProfileState(JSON.parse(stored));
      } catch {
        // Ignore malformed stored profile and start fresh.
      }
    }
    setHydrated(true);
  }, []);

  const setProfile = (next: UserProfile) => {
    setProfileState(next);
    window.localStorage.setItem(storageKey, JSON.stringify(next));
  };

  const value = useMemo(
    () => ({
      profile,
      setProfile,
      hasCompletedQuiz: hydrated && Object.keys(profile).length > 0,
    }),
    [profile, hydrated]
  );

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used inside UserProfileProvider");
  }
  return context;
}
