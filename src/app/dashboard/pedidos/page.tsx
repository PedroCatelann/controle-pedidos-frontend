"use client";
import CustomSpinner from "@/components/CustomSpinner";
import { withAuth } from "@/hoc/withAuth";
import { Pedido, PedidoResponse, TipoOperacao } from "@/services/models";
import { useRootStore } from "@/store";
import { formatDateForDelivery, formatDateOnly } from "@/utils/utils";
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
import { showSuccess, showAxiosError, showError } from "@/utils/toast";

const PedidoConsulta: React.FC = observer(() => {
  const router = useRouter();

  const { pedidoStore } = useRootStore();
  const [checkedPedidos, setCheckedPedidos] = useState<Record<number, boolean>>(
    {},
  );

  const { register, handleSubmit, control, setValue, reset, getValues } =
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
      .listarPedidos(data)
      .then(() => {
        pedidoStore.saveInfoToSearch(data);
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };

  const passouPedidoEntrega = (id: number, hasPassed: boolean) => {
    const values = getValues();
    pedidoStore
      .passouPedidoEntrega(id, hasPassed, {
        dataPedido: values.dataPedido,
        funcionario: values.funcionario,
        nomeCliente: values.nomeCliente,
      })
      .then(() => {
        showSuccess(formatDateForDelivery(new Date()));
        listarPedidos(values);
      })
      .catch((error) => {
        showAxiosError(error);
      });
  };

  const alterarStatusPedido = (
    id: number,
    isEntregue: boolean,
    isPassouEntrega?: boolean,
  ) => {
    if (!isPassouEntrega) {
      showError(
        "O pedido deve ser passado para o entregador antes de ser marcado como entregue.",
      );
      return;
    }

    pedidoStore
      .alterarStatusPedido(id, isEntregue)
      .then(() => {
        setCheckedPedidos((prev) => ({
          ...prev,
          [id]: isEntregue,
        }));

        showSuccess("Pedido marcado como entregue!");
        listarPedidos(
          pedidoStore.infoToSearch || {
            nomeCliente: "",
            funcionario: undefined,
            dataPedido: new Date(),
          },
        );
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
          <AccordionTitle>Consulta de Pedidos</AccordionTitle>
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
              <TableHeadCell>Nome Cliente</TableHeadCell>
              <TableHeadCell>Rua</TableHeadCell>
              <TableHeadCell>Número</TableHeadCell>
              <TableHeadCell>Bairro</TableHeadCell>
              <TableHeadCell>Entregador</TableHeadCell>
              <TableHeadCell>Observação</TableHeadCell>
              <TableHeadCell>Passou para entrega</TableHeadCell>
              <TableHeadCell>Entregue?</TableHeadCell>
              <TableHeadCell>Urgência</TableHeadCell>
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
            {pedidoStore.listaPedidos.map((ped) => (
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
                <TableCell>
                  <Checkbox
                    checked={ped.passouEntregador}
                    onChange={(e) =>
                      passouPedidoEntrega(ped.id, e.target.checked)
                    }
                    disabled={ped.passouEntregador}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={checkedPedidos[ped.id] || false}
                    onChange={(e) => {
                      alterarStatusPedido(
                        ped.id,
                        e.target.checked,
                        ped.passouEntregador,
                      );
                    }}
                  />
                </TableCell>
                <TableCell style={{}}>
                  <div
                    className="h-4 w-4"
                    style={{
                      backgroundColor: ped.color,
                      margin: "0 auto",
                      borderRadius: "4px",
                    }}
                  ></div>
                </TableCell>
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

export default withAuth(PedidoConsulta);
