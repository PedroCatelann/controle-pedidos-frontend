"use client";

import { ButtonComponent } from "@/components/ButtonComponent";
import { withAuth } from "@/hoc/withAuth";
import {
  ButtonEnum,
  Pedido,
  PedidoRequest,
  TipoOperacao,
} from "@/services/models";
import { useRootStore } from "@/store";
import { Card, Label, Select, TextInput } from "flowbite-react";
import { observer } from "mobx-react-lite";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { showSuccess, showAxiosError } from "@/utils/toast";

type ParametrosRegistro = {
  operacao: string;
  id: string; // O ID virá do [id]
};

const PedidoCadastro: React.FC = observer(() => {
  const { pedidoStore } = useRootStore();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const operacaoQuery = searchParams.get("operacao");
  let operacaoFinal: string;

  if (operacaoQuery) {
    operacaoFinal = operacaoQuery;
  } else if (id === "novo") {
    operacaoFinal = TipoOperacao.CRIAR; // Fallback se '/novo' for acessado sem ?operacao=criar
  } else {
    operacaoFinal = TipoOperacao.VISUALIZAR; // Modo padrão se apenas o ID for passado sem query
  }

  const parametros: ParametrosRegistro = {
    operacao: operacaoFinal,
    id: id,
  };

  useEffect(() => {
    if (
      operacaoFinal === TipoOperacao.EDITAR ||
      operacaoFinal === TipoOperacao.VISUALIZAR
    ) {
      if (parametros.id && parametros.id !== "novo") {
        pedidoStore.getPedido(Number(parametros.id)).then(() => {
          console.log(pedidoStore.pedidoAtual);
          reset({
            bairro: pedidoStore.pedidoAtual?.bairro,
            complemento: pedidoStore.pedidoAtual?.complemento,
            funcionario_id: pedidoStore.pedidoAtual?.funcionario.id,
            id: pedidoStore.pedidoAtual?.id,
            nomeCliente: pedidoStore.pedidoAtual?.nomeCliente,
            numero: pedidoStore.pedidoAtual?.numero,
            observacao: pedidoStore.pedidoAtual?.observacao,
            rua: pedidoStore.pedidoAtual?.rua,
            telefone: pedidoStore.pedidoAtual?.telefone,
            isEntregue: pedidoStore.pedidoAtual?.isEntregue,
          });
        });
      }
    }
  }, [operacaoFinal, parametros.id]);

  useEffect(() => {
    pedidoStore.listarFuncionarios().catch((error) => {
      showAxiosError(error);
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
    reset,
  } = useForm<Pedido>();

  const handleIncluir = (data: FieldValues) => {
    const pedido: PedidoRequest = {
      funcionario_id: data.funcionario_id,
      telefone: data.telefone,
      bairro: data.bairro,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      observacao: data.observacao,
      nomeCliente: data.nomeCliente,
    };

    pedidoStore
      .incluirPedido(pedido)
      .then(() => {
        showSuccess("Pedido cadastrado com sucesso!");
        router.push(`/dashboard/pedidos`);
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };

  const handleEditar = (data: FieldValues) => {
    const pedido: PedidoRequest = {
      id: Number(parametros.id),
      funcionario_id: data.funcionario_id,
      telefone: data.telefone,
      bairro: data.bairro,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
      observacao: data.observacao,
      nomeCliente: data.nomeCliente,
    };

    pedidoStore
      .editarPedido(pedido)
      .then(() => {
        showSuccess("Pedido atualizado com sucesso!");
        router.push(`/dashboard/pedidos`);
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };

  const cancelarOperacao = (nomePage: string) => {
    router.push(`/dashboard/${nomePage}`);
  };

  return (
    <div className="flex justify-center items-center mt-10 mb-10">
      <Card className="max-w-md mx-auto w-96">
        <h1 className="mx-auto font-bold">Adicionar novo pedido!</h1>
        <form
          onSubmit={
            operacaoFinal === TipoOperacao.CRIAR
              ? handleSubmit(handleIncluir)
              : handleSubmit(handleEditar)
          }
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="funcionario">
                Funcionário que irá realizar a entrega
              </Label>
            </div>
            <Select
              id="funcionario"
              disabled={parametros.operacao === "visualizar"}
              sizing="sm"
              {...register("funcionario_id", {
                required: "O funcionário é obrigatório",
                valueAsNumber: true,
              })}
            >
              {pedidoStore.listaFuncionarios.map((func) => (
                <option key={func.id} value={func.id}>
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
              disabled={parametros.operacao === "visualizar"}
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
              disabled={parametros.operacao === "visualizar"}
              type="text"
              sizing="sm"
              {...register("bairro")}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="rua">Rua</Label>
            </div>
            <TextInput
              id="rua"
              disabled={parametros.operacao === "visualizar"}
              type="text"
              sizing="sm"
              {...register("rua")}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="numero">Número</Label>
            </div>
            <TextInput
              id="numero"
              disabled={parametros.operacao === "visualizar"}
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
              disabled={parametros.operacao === "visualizar"}
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
              disabled={parametros.operacao === "visualizar"}
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
              disabled={parametros.operacao === "visualizar"}
              type="text"
              sizing="sm"
              {...register("nomeCliente")}
            />
          </div>
          <div className="flex flex-row justify-center mt-8 gap-8">
            {operacaoFinal === TipoOperacao.EDITAR ? (
              <ButtonComponent type="submit" operacao={ButtonEnum.EDITAR}>
                Editar
              </ButtonComponent>
            ) : operacaoFinal === TipoOperacao.CRIAR ? (
              <ButtonComponent type="submit" operacao={ButtonEnum.CRIAR}>
                Cadastrar
              </ButtonComponent>
            ) : null}

            <ButtonComponent
              operacao={ButtonEnum.CANCELAR}
              handleCancelar={cancelarOperacao}
              nomePage="pedidos"
              type="button"
            >
              Cancelar
            </ButtonComponent>
          </div>
        </form>
      </Card>
    </div>
  );
});

export default withAuth(PedidoCadastro);
