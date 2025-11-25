"use client";
import { Pedido, PedidoResponse, TipoOperacao } from "@/services/models";
import { useRootStore } from "@/store";
import { formatDateOnly } from "@/utils/utils";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Button,
  Datepicker,
  Label,
  Select,
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
import React, { useEffect, useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";

const PedidoConsulta: React.FC = observer(() => {
  const router = useRouter();

  const { pedidoStore } = useRootStore();

  const [infoSearch, setInfoSearch] = useState<PedidoResponse | undefined>(
    undefined
  );

  const { register, handleSubmit, control, setValue } = useForm<PedidoResponse>(
    {
      defaultValues: {
        nomeCliente: "",
        funcionario: undefined,
        dataPedido: new Date(),
      },
    }
  );

  useEffect(() => {
    pedidoStore
      .listarFuncionarios()

      .catch(() => console.log("Erro ao listar funcionários"));
  }, []);

  useEffect(() => {
    const savedSearch = pedidoStore.infoToSearch;
    if (savedSearch) {
      listarPedidos(savedSearch);
    }
  }, [pedidoStore.infoToSearch]);

  const listarPedidos = (data: PedidoResponse) => {
    console.log(data);
    pedidoStore.listarPedidos(data).then(() => {
      console.log("Pedido LISTADOS!");
      setInfoSearch(data);
    });
  };

  const handleNavegate = (operacao: TipoOperacao, id?: number) => {
    infoSearch && pedidoStore.saveInfoToSearch(infoSearch);
    if (
      operacao === TipoOperacao.VISUALIZAR ||
      operacao === TipoOperacao.EDITAR
    )
      router.push(`/pedidos/operacoes/${id}?operacao=${operacao}`);
    else router.push(`/pedidos/operacoes/novo`);
  };

  const excluirFunction = (id?: number) => {
    if (id == null) return;
    pedidoStore.deletePedido(id).then(() => {
      console.log("Pedido DELETADO!");
      listarPedidos({});
    });
  };
  return (
    <div className="w-full px-4 py-16 mt-10">
      <Accordion>
        <AccordionPanel>
          <AccordionTitle>Consulta de Pedidos</AccordionTitle>
          <AccordionContent>
            <div>
              <form
                onSubmit={handleSubmit(listarPedidos)}
                className="flex flex-col justify-center items-center"
              >
                <div
                  className="flex flex-row flex-nowrap justify-center items-start gap-8 w-full"
                  style={{ width: "100%" }}
                >
                  <div className="flex-1 min-w-[220px] max-w-md flex flex-col gap-2">
                    <div className="mb-2 block">
                      <Label htmlFor="nome">Nome do Cliente</Label>
                    </div>
                    <TextInput
                      id="nome"
                      type="text"
                      sizing="sm"
                      className="w-full sm:w-3/4"
                      {...register("nomeCliente")}
                    ></TextInput>
                  </div>
                  <div className="flex-1 min-w-[220px] max-w-md flex flex-col gap-2">
                    <div className="mb-2 block">
                      <Label htmlFor="nome">Funcionário alocado</Label>
                    </div>
                    <Select
                      id="funcionario"
                      className="w-full sm:w-3/4"
                      sizing="sm"
                      {...register("funcionario")}
                    >
                      {pedidoStore.listaFuncionarios.map((func) => (
                        <option key={func.id} value={func.id}>
                          {func.nome}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="flex-1 min-w-[220px] max-w-md flex flex-col gap-2">
                    <div className="mb-2 block">
                      <Label htmlFor="dataPedido">Data do pedido</Label>
                    </div>
                    <Controller
                      control={control}
                      name="dataPedido"
                      render={({ field: { onChange, value } }) => (
                        <Datepicker
                          language="pt-BR"
                          className="w-full sm:w-3/4"
                          labelTodayButton="Hoje"
                          labelClearButton="Limpar"
                          value={value}
                          onChange={(v) => onChange(v)}
                        />
                      )}
                    />
                  </div>
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
                    Listar Pedidos
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
            {pedidoStore.listaPedidos.map((ped, index) => (
              <TableRow
                key={index}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>{ped.complemento}</TableCell>
                <TableCell>{ped.bairro}</TableCell>
                <TableCell>
                  <button
                    onClick={() =>
                      handleNavegate(TipoOperacao.VISUALIZAR, ped.id)
                    }
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    <FaSearch />
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleNavegate(TipoOperacao.EDITAR, ped.id)}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    <MdEdit />
                  </button>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => excluirFunction(ped.id)}
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

export default PedidoConsulta;
