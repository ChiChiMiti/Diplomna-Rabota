import { useEffect, useState } from "react";
import { auth, login, register, logout, getUserById } from "@/api";
import { User } from "@/models";

export const useFirebaseAuth = () => {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clear = () => {
    setAuthUser(null);
  };

  const signOut = () => logout().then(clear);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authStateChanged) => {
      if (!authStateChanged) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const user = await getUserById(authStateChanged.uid);

      setAuthUser({
        id: authStateChanged.uid || "",
        email: authStateChanged.email || "",
        role: user.role,
        createdAt: user.createdAt,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    register,
    login,
    signOut,
  };
};
