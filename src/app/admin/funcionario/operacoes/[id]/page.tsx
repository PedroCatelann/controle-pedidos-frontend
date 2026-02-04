"use client";

import { ButtonComponent } from "@/components/ButtonComponent";
import { ROLES } from "@/services/constants";
import { ButtonEnum, Funcionario, Role, TipoOperacao } from "@/services/models";
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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { showSuccess, showAxiosError } from "@/utils/toast";

type FormValues = {
  nome: string;
  roles: Role;
};

type ParametrosRegistro = {
  operacao: string;
  id: string; // O ID virá do [id]
};

const FuncionarioOperacoes: React.FC = observer(() => {
  const router = useRouter();
  const { funcionarioStore } = useRootStore();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const operacaoQuery = searchParams.get("operacao");
  let operacaoFinal: string;
  const nomePage: string = "funcionario";

  if (operacaoQuery) {
    operacaoFinal = operacaoQuery;
  } else if (id === "novo") {
    operacaoFinal = TipoOperacao.CRIAR; // Fallback se '/novo' for acessado sem ?operacao=criar
  } else {
    operacaoFinal = TipoOperacao.VISUALIZAR; // Modo padrão se apenas o ID for passado sem query
  }

  // Estruturando o objeto de parâmetros
  const parametros: ParametrosRegistro = {
    operacao: operacaoFinal,
    id: id,
  };

  // --- Lógica de renderização ---
  let titulo = "";

  switch (parametros.operacao) {
    case TipoOperacao.CRIAR:
      titulo = "Nova Entrada";
      break;
    case TipoOperacao.EDITAR:
      titulo = `Editando Registro #${parametros.id}`;
      break;
    case TipoOperacao.VISUALIZAR:
      titulo = `Visualizando Registro #${parametros.id}`;
      break;
    default:
      titulo = "Ação Desconhecida";
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setError,
    reset,
  } = useForm<FormValues>();

  useEffect(() => {
    if (operacaoFinal === "criar") {
      reset();
    }
    if (!isNaN(Number(id))) {
      funcionarioStore.getFuncionario(Number(id)).then(() => {
        reset({
          nome: funcionarioStore.funcionarioAtual?.nome,
          roles: funcionarioStore.funcionarioAtual?.roles,
        });
      });
    }
  }, [operacaoFinal, id]);

  const incluirFuncionario = (data: FieldValues) => {
    const dataFunc: Funcionario = {
      nome: data.nome,
      roles: data.roles,
    };
    funcionarioStore
      .incluirFuncionario(dataFunc)
      .then(() => {
        showSuccess("Funcionário cadastrado com sucesso!");
        router.push(`/admin/funcionario`);
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };

  const cancelarOperacao = (nomePage: string) => {
    router.push(`/admin/${nomePage}`);
  };

  const editarFuncionario = (data: FieldValues) => {
    const dataFunc: Funcionario = {
      id: id ? Number(id) : undefined,
      nome: data.nome,
      roles: data.roles,
    };
    if (!id) return;
    if (
      funcionarioStore &&
      typeof funcionarioStore.editarFuncionario === "function"
    ) {
      funcionarioStore
        .editarFuncionario(Number(id), dataFunc)
        .then(() => {
          showSuccess("Funcionário atualizado com sucesso!");
          router.push(`/admin/funcionario`);
        })
        .catch((error) => {
          showAxiosError(error);
        });
    } else {
      console.error(
        "editarFuncionario não encontrada em funcionarioStore",
        funcionarioStore,
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="max-w-md mx-auto w-96">
        <h1 className="mx-auto font-bold">{titulo}</h1>
        <form
          onSubmit={
            operacaoFinal === TipoOperacao.CRIAR
              ? handleSubmit(incluirFuncionario)
              : handleSubmit(editarFuncionario)
          }
        >
          <div className="flex max-w-md flex-col gap-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="nome">Nome</Label>
              </div>
              <TextInput
                id="nome"
                type="text"
                sizing="sm"
                readOnly={parametros.operacao === "visualizar"}
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
                disabled={parametros.operacao === "visualizar"}
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
              nomePage="funcionario"
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

export default FuncionarioOperacoes;
