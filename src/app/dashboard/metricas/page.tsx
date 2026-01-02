"use client";

import { apiBackEnd } from "@/services/api";
import { Funcionario, MetricasFuncionarioPedido } from "@/services/models";
import {
  Button,
  Card,
  Label,
  Select,
  Spinner,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomSpinner from "@/components/CustomSpinner";
import { withAuth } from "@/hoc/withAuth";

interface MetricasFormData {
  idFuncionario: number;
  ano: number;
  mes: number;
}

const MetricasPage: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [metricas, setMetricas] = useState<MetricasFuncionarioPedido | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFuncionarios, setIsLoadingFuncionarios] = useState(false);

  const { register, handleSubmit } = useForm<MetricasFormData>({
    defaultValues: {
      idFuncionario: 0,
      ano: new Date().getFullYear(),
      mes: new Date().getMonth() + 1,
    },
  });

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  const carregarFuncionarios = async () => {
    setIsLoadingFuncionarios(true);
    try {
      const response = await apiBackEnd.get("/funcionarios/listar", {
        params: { nome: "" },
      });
      setFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar funcionários:", error);
    } finally {
      setIsLoadingFuncionarios(false);
    }
  };

  const buscarMetricas = async (data: MetricasFormData) => {
    if (!data.idFuncionario) {
      alert("Por favor, selecione um funcionário");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiBackEnd.get("/metricas/funcionario-pedido", {
        params: {
          idFuncionario: data.idFuncionario,
          ano: data.ano,
          mes: data.mes,
        },
      });
      setMetricas(response.data);
    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
      alert("Erro ao buscar métricas. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Converter pedidosPorDia em formato para o gráfico
  const dadosGrafico = metricas
    ? Object.entries(metricas.pedidosPorDia).map(([data, quantidade]) => ({
        data: new Date(data).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        quantidade,
      }))
    : [];

  // Gerar anos (últimos 5 anos)
  const anos = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  // Meses
  const meses = [
    { valor: 1, nome: "Janeiro" },
    { valor: 2, nome: "Fevereiro" },
    { valor: 3, nome: "Março" },
    { valor: 4, nome: "Abril" },
    { valor: 5, nome: "Maio" },
    { valor: 6, nome: "Junho" },
    { valor: 7, nome: "Julho" },
    { valor: 8, nome: "Agosto" },
    { valor: 9, nome: "Setembro" },
    { valor: 10, nome: "Outubro" },
    { valor: 11, nome: "Novembro" },
    { valor: 12, nome: "Dezembro" },
  ];

  return (
    <div className="w-full px-4 py-8 mt-10">
      <CustomSpinner isLoading={isLoading || isLoadingFuncionarios} />
      
      <h1 className="text-3xl font-bold mb-6">Métricas de Entregas</h1>

      {/* Formulário de Filtros */}
      <Card className="mb-6">
        <form
          onSubmit={handleSubmit(buscarMetricas)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="idFuncionario" className="mb-2 block">
                Funcionário
              </Label>
              <Select
                id="idFuncionario"
                {...register("idFuncionario", {
                  valueAsNumber: true,
                })}
                disabled={isLoadingFuncionarios}
              >
                <option value={0}>Selecione um funcionário</option>
                {funcionarios.map((func) => (
                  <option key={func.id} value={func.id}>
                    {func.nome}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="ano" className="mb-2 block">
                Ano
              </Label>
              <Select
                id="ano"
                {...register("ano", { valueAsNumber: true })}
              >
                {anos.map((ano) => (
                  <option key={ano} value={ano}>
                    {ano}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="mes" className="mb-2 block">
                Mês
              </Label>
              <Select
                id="mes"
                {...register("mes", { valueAsNumber: true })}
              >
                {meses.map((mes) => (
                  <option key={mes.valor} value={mes.valor}>
                    {mes.nome}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Buscando...
                </>
              ) : (
                "Buscar Métricas"
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Resultados */}
      {metricas && (
        <div className="space-y-6">
          {/* Gráfico de Pedidos por Dia */}
          <Card>
            <h2 className="text-2xl font-semibold mb-4">
              Pedidos por Dia
            </h2>
            {dadosGrafico.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dadosGrafico}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade de Pedidos" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhum dado disponível para o período selecionado.
              </p>
            )}
          </Card>

          {/* Cards com Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Média de Minutos */}
            <Card>
              <h3 className="text-lg font-semibold mb-2">
                Média de Tempo de Entrega
              </h3>
              <p className="text-3xl font-bold text-blue-600">
                {metricas.mediaMinutos.toFixed(2)}
              </p>
              <p className="text-gray-500 mt-1">minutos</p>
            </Card>

            {/* Entrega Mais Demorada */}
            <Card>
              <h3 className="text-lg font-semibold mb-4">
                Entrega Mais Demorada
              </h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Cliente:</p>
                  <p className="font-medium">{metricas.entregaMaisDemoradaDTO.nomeCliente}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Endereço:</p>
                  <p className="font-medium">{metricas.entregaMaisDemoradaDTO.endereco}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Data:</p>
                  <p className="font-medium">
                    {new Date(metricas.entregaMaisDemoradaDTO.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tempo:</p>
                  <p className="font-bold text-red-600 text-xl">
                    {metricas.entregaMaisDemoradaDTO.tempoParaEntrega.toFixed(2)} minutos
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(MetricasPage);

