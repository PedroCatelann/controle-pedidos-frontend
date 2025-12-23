import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard</h1>
        <p>Bem-vindo ao sistema</p>
      </div>
    </ProtectedRoute>
  );
}
