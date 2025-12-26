import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={["ROLE_ADMIN"]}>
      <h1>Área Administrativa</h1>
    </ProtectedRoute>
  );
}
