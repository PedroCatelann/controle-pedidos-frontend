"use client";

import { Role } from "@/services/models";
import { useRootStore } from "@/store";
import { Button, Card } from "flowbite-react";

import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";

type FormValues = {
  nome: string;
  role: Role;
};

const FuncionarioOperacoes: React.FC = observer(() => {
  const { funcionarioStore } = useRootStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
    reset,
  } = useForm<FormValues>();

  return (
    <Card className="max-w-sm">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        Configuração com Sucesso!
      </h5>
      <p className="font-normal text-gray-700 dark:text-gray-400">
        Este Card e Botão vieram do Flowbite React.
      </p>
      <Button>
        <p>Vamos lá!</p>
      </Button>
    </Card>
  );
});

export default FuncionarioOperacoes;
