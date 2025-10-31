"use client";

import { ROLES } from "@/services/constants";
import { Funcionario, Role } from "@/services/models";
import { useRootStore } from "@/store";
import {
  Button,
  Card,
  Datepicker,
  Label,
  Select,
  TextInput,
} from "flowbite-react";

import { observer } from "mobx-react-lite";
import { FieldValues, useForm } from "react-hook-form";

type FormValues = {
  nome: string;
  roles: Role;
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

  const incluirFuncionario = (data: FieldValues) => {
    console.log(data);
    const dataFunc: Funcionario = {
      nome: data.nome,
      roles: data.roles,
    };
    funcionarioStore.incluirFuncionario(dataFunc).then(() => {
      console.log("FUNCIONÁRIO CADASTRADO!");
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-md mx-auto w-96">
        <h1 className="mx-auto font-bold">Cadastro de funcionários</h1>
        <form onSubmit={handleSubmit(incluirFuncionario)}>
          <div className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nome">Nome</Label>
              </div>
              <TextInput
                id="nome"
                type="text"
                sizing="sm"
                {...register("nome", { required: "O nome é obrigatório" })}
              />
              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nome.message}
                </p>
              )}
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="roles">Permissões</Label>
              </div>
              <Select
                id="roles"
                sizing="sm"
                {...register("roles", {
                  required: "A permissão é obrigatória",
                })}
              >
                {ROLES.map((option) => (
                  <option key={option.value} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex flex-row justify-between mt-8">
            <Button type="submit" color="green" outline>
              Cadastrar
            </Button>
            <Button color="red" outline>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
});

export default FuncionarioOperacoes;
