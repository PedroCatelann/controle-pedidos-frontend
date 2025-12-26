"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
  requiredRoles?: string[];
};

export function ProtectedRoute({ children, requiredRoles }: Props) {
  const { isAuthenticated, loading, roles } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (requiredRoles && !requiredRoles.some((role) => roles.includes(role))) {
      router.replace("/403"); // página de acesso negado
    }
  }, [loading, isAuthenticated, roles, requiredRoles, router]);

  if (loading) {
    return null; // ou spinner
  }

  if (requiredRoles && !requiredRoles.some((role) => roles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
