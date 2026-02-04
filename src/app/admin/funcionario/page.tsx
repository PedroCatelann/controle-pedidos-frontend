"use client";

import { FuncionarioResponse, TipoOperacao } from "@/services/models";
import { useRootStore } from "@/store";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Button,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  TextInput,
} from "flowbite-react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { showSuccess, showAxiosError } from "@/utils/toast";

const FuncionarioConsulta: React.FC = observer(() => {
  const router = useRouter();
  const { funcionarioStore } = useRootStore();

  const [infoSearch, setInfoSearch] = useState<FuncionarioResponse | undefined>(
    undefined,
  );

  const { register, handleSubmit } = useForm<FuncionarioResponse>();

  useEffect(() => {
    const savedSearch = funcionarioStore.infoToSearch;
    if (savedSearch) {
      listarFuncionarios(savedSearch);
    }
  }, [funcionarioStore.infoToSearch]);

  const listarFuncionarios = (data: FieldValues) => {
    funcionarioStore
      .listarFuncionarios(data)
      .then(() => {
        setInfoSearch(data);
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };

  const handleNavegate = (operacao: TipoOperacao, id?: number) => {
    infoSearch && funcionarioStore.saveInfoToSearch(infoSearch);
    if (
      operacao === TipoOperacao.VISUALIZAR ||
      operacao === TipoOperacao.EDITAR
    )
      router.push(`/admin/funcionario/operacoes/${id}?operacao=${operacao}`);
    else router.push(`/admin/funcionario/operacoes/novo`);
  };

  const excluirFunction = (id?: number) => {
    if (id == null) return;
    funcionarioStore
      .deleteFuncionario(id)
      .then(() => {
        showSuccess("Funcionário excluído com sucesso!");
        listarFuncionarios({ nome: "" });
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };

  return (
    <div className="w-full px-4 py-16 mt-10">
      <Accordion>
        <AccordionPanel>
          <AccordionTitle>Consulta de Funcionários</AccordionTitle>
          <AccordionContent>
            <div>
              <form
                onSubmit={handleSubmit(listarFuncionarios)}
                className="flex flex-col justify-center items-center"
              >
                <div className="flex flex-col gap-2 max-w-md w-full">
                  <div className="mb-2 block">
                    <Label htmlFor="nome">Nome do Funcionário</Label>
                  </div>
                  <TextInput
                    id="nome"
                    type="text"
                    sizing="sm"
                    {...register("nome")}
                  ></TextInput>
                </div>
                <div className="flex flex-row justify-center gap-2">
                  <Button
                    outline
                    onClick={() => handleNavegate(TipoOperacao.CRIAR)}
                    className="mt-4"
                  >
                    Novo
                  </Button>
                  <Button outline type="submit" className="mt-4">
                    Listar Funcionários
                  </Button>
                </div>
              </form>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
      <div className="overflow-x-auto">
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Nome funcionário</TableHeadCell>
              <TableHeadCell>Role</TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Consultar</span>
              </TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Editar</span>
              </TableHeadCell>
              <TableHeadCell>
                <span className="sr-only">Deletar</span>
              </TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y">
            {funcionarioStore.listaFuncionarios.map((func, index) => (
              <TableRow
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>{func.nome}</TableCell>
                <TableCell>{func.roles}</TableCell>
                <TableCell>
                  <button
                    onClick={() =>
                      handleNavegate(TipoOperacao.VISUALIZAR, func.id)
                    }
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    <FaSearch />
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleNavegate(TipoOperacao.EDITAR, func.id)}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    <MdEdit />
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => excluirFunction(func.id)}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    <MdDelete />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

export default FuncionarioConsulta;
