"use client";

import { useAuth } from "@/context/AuthContext";
import { apiBackEnd } from "@/services/api";
import { login } from "@/services/auth.service";
import { Button, Card, Label, TextInput } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const router = useRouter();

  const { login: loginContext } = useAuth();

  const onSubmit = async (data: LoginForm) => {
    try {
      const { accessToken, refreshToken } = await login(data);

      loginContext(accessToken, refreshToken); // 🔑 PASSO MAIS IMPORTANTE

      router.replace("/dashboard/pedidos");
    } catch (error) {
      console.error("Erro ao logar", error);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <Card className="w-full max-w-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Login</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <Label htmlFor="username" />
            <TextInput
              id="username"
              type="text"
              {...register("username", {
                required: "Nome de usuário é obrigatório",
              })}
              color={errors.username ? "failure" : "gray"}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Senha */}
          <div>
            <Label htmlFor="password" />
            <TextInput
              id="password"
              type="password"
              placeholder="********"
              {...register("password", {
                required: "Senha é obrigatória",
              })}
              color={errors.password ? "failure" : "gray"}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Botão */}
          <Button type="submit">Entrar</Button>
        </form>
      </Card>
    </div>
  );
}
