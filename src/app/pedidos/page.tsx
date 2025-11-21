"use client";

import { Pedido } from "@/services/models";
import { useRootStore } from "@/store";
import { Card, Label, Select, TextInput } from "flowbite-react";
import { observer } from "mobx-react-lite";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const PedidoCadastro: React.FC = observer(() => {
  //const router = useRouter();
  const { pedidoStore } = useRootStore();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    pedidoStore
      .listarFuncionarios()
      .catch(() => console.log("Erro ao listar funcionários"));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
    reset,
  } = useForm<Pedido>();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-md mx-auto w-96">
        <h1 className="mx-auto font-bold">Adicionar novo pedido!</h1>
        <form>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="funcionario">
                Funcionário que irá realizar a entrega
              </Label>
            </div>
            <Select
              id="funcionario"
              sizing="sm"
              {...register("funcionario", {
                required: "O funcionário é obrigatório",
              })}
            >
              {pedidoStore.listaFuncionarios.map((func) => (
                <option key={func.id} value={func.nome}>
                  {func.nome}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="phone-input">Telefone</Label>
            </div>
            <TextInput
              id="phone-input"
              type="tel" // Usa o tipo 'tel' para melhor usabilidade em dispositivos móveis
              placeholder="(99) 99999-9999"
              required
              {...register("telefone")}
              // Limita o input visualmente, mas a formatação controla o tamanho real
              maxLength={15}
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Exemplo: (11) 98765-4321
            </p>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="bairro">Bairro</Label>
            </div>
            <TextInput
              id="bairro"
              type="text"
              sizing="sm"
              {...register("bairro")}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="rua">Rua</Label>
            </div>
            <TextInput id="rua" type="text" sizing="sm" {...register("rua")} />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="numero">Número</Label>
            </div>
            <TextInput
              id="numero"
              type="text"
              sizing="sm"
              {...register("numero")}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="complemento">Complemento</Label>
            </div>
            <TextInput
              id="complemento"
              type="text"
              sizing="sm"
              {...register("complemento")}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="observacao">Observacao</Label>
            </div>
            <TextInput
              id="observacao"
              type="text"
              sizing="sm"
              {...register("observacao")}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="nomeCLiente">Nome do Cliente</Label>
            </div>
            <TextInput
              id="nomeCliente"
              type="text"
              sizing="sm"
              {...register("nomeCliente")}
            />
          </div>
        </form>
      </Card>
    </div>
  );
});

export default PedidoCadastro;
