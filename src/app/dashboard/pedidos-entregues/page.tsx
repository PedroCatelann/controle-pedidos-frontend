"use client";
import CustomSpinner from "@/components/CustomSpinner";
import { withAuth } from "@/hoc/withAuth";
import { Pedido, PedidoResponse, TipoOperacao } from "@/services/models";
import { useRootStore } from "@/store";
import { formatDate, formatDateOnly } from "@/utils/utils";
import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
  Button,
  Checkbox,
  Datepicker,
  Label,
  Select,
  Spinner,
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
import { showSuccess, showAxiosError } from "@/utils/toast";

const PedidoConsulta: React.FC = observer(() => {
  const router = useRouter();

  const { pedidoStore } = useRootStore();

  const { register, handleSubmit, control, setValue, reset } =
    useForm<PedidoResponse>({
      defaultValues: {
        nomeCliente: "",
        funcionario: undefined,
        dataPedido: new Date(),
      },
    });

  useEffect(() => {
    pedidoStore.listarFuncionarios().catch((error) => {
      showAxiosError(error);
    });
  }, []);

  useEffect(() => {
    console.log(pedidoStore.isLoading);
    const savedSearch = pedidoStore.infoToSearch;
    if (savedSearch) {
      listarPedidos(savedSearch);
      reset({
        nomeCliente: savedSearch.nomeCliente,
        funcionario: savedSearch.funcionario,
        dataPedido: savedSearch.dataPedido,
      });
    }
  }, [pedidoStore.infoToSearch]);

  const listarPedidos = (data: PedidoResponse) => {
    pedidoStore
      .listarPedidosEntregues(data)
      .then(() => {
        pedidoStore.saveInfoToSearch(data);
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };

  const handleNavegate = (operacao: TipoOperacao, id?: number) => {
    if (
      operacao === TipoOperacao.VISUALIZAR ||
      operacao === TipoOperacao.EDITAR
    )
      router.push(`/dashboard/pedidos/operacoes/${id}?operacao=${operacao}`);
    else router.push(`/dashboard/pedidos/operacoes/novo`);
  };

  const excluirFunction = (id?: number) => {
    if (id == null) return;
    pedidoStore
      .deletePedido(id)
      .then(() => {
        showSuccess("Pedido excluído com sucesso!");
        listarPedidos({});
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };
  return (
    <div className="w-full px-4 py-16 mt-10">
      <CustomSpinner isLoading={pedidoStore.isLoading} />
      <Accordion>
        <AccordionPanel>
          <AccordionTitle>Consulta de Pedidos Entregues</AccordionTitle>
          <AccordionContent>
            <div>
              <div className="flex flex-wrap items-center gap-2"></div>
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
                  {/* <Button
                    outline
                    onClick={() => handleNavegate(TipoOperacao.CRIAR)}
                    className="mt-4"
                  >
                    Novo
                  </Button> */}
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
              <TableHeadCell>Nome Cliente</TableHeadCell>
              <TableHeadCell>Rua</TableHeadCell>
              <TableHeadCell>Número</TableHeadCell>
              <TableHeadCell>Bairro</TableHeadCell>
              <TableHeadCell>Entregador</TableHeadCell>
              <TableHeadCell>Observação</TableHeadCell>
              <TableHeadCell>Data/Hora do Pedido</TableHeadCell>
              <TableHeadCell>Data/Hora da Entrega</TableHeadCell>
            </TableRow>
          </TableHead>

          <TableBody className="divide-y">
            {pedidoStore.listaPedidosEntregues.map((ped) => (
              <TableRow
                key={ped.id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <TableCell>{ped.nomeCliente}</TableCell>
                <TableCell>{ped.rua}</TableCell>
                <TableCell>{ped.numero}</TableCell>
                <TableCell>{ped.bairro}</TableCell>
                <TableCell>{ped.funcionario.nome}</TableCell>
                <TableCell>{ped.observacao}</TableCell>
                <TableCell>{formatDate(ped.dataHoraInclui)}</TableCell>
                <TableCell>{formatDate(ped.dataHoraEntregue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
});

export default withAuth(PedidoConsulta);
