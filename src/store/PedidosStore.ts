import { apiBackEnd } from "@/services/api";
import {
  Funcionario,
  Pedido,
  PedidoRequest,
  PedidoResponse,
} from "@/services/models";
import { AxiosError } from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";

type Color = "green" | "yellow" | "red" | "default";

export class PedidoStore {
  private currentPedido: Pedido | null = null;
  private _listaPedidos: Pedido[] = [];
  private _listaPedidosEntregues: Pedido[] = [];
  private _listaFuncionarios: Funcionario[] = [];
  private saveInfoSearch: PedidoResponse | null = null;
  isLoading: boolean = false;

  public responseData = {
    typeRequest: "",
    statusRequest: 0,
  };

  constructor() {
    makeAutoObservable(this, {
      isLoading: observable,
      incluirPedido: action,
      editarPedido: action,
      getPedido: action,

      clean: action,
    });
  }

  clean() {
    this.currentPedido = null;
    this.isLoading = false;
    this.responseData = {
      typeRequest: "",
      statusRequest: 0,
    };
  }

  async incluirPedido(Pedido: PedidoRequest) {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const response = await apiBackEnd.post("/pedidos", Pedido);
      const { config, status } = response;
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async editarPedido(Pedido: PedidoRequest) {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const response = await apiBackEnd.put(`/pedidos`, Pedido);
      const { config, status } = response;
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async getPedido(id: number) {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const response = await apiBackEnd.get(`/pedidos/${id}`);
      this.currentPedido = response.data;
      runInAction(() => {
        this.isLoading = false;
      });
      console.log(this.currentPedido);
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async deletePedido(id: number) {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      await apiBackEnd.delete(`/pedidos/${id}`);
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async listarPedidos(ped: PedidoResponse) {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const response = await apiBackEnd.get("/pedidos/listar", {
        params: {
          dataPedido: ped.dataPedido,
          funcionario: ped.funcionario,
          nomeCliente: ped.nomeCliente,
        },
      });
      let listaTodosPedidos = response.data;

      let listaPedidos = listaTodosPedidos.filter(
        (p: Pedido) => p.isEntregue === false
      );
      //this._listaPedidos = listaPedidos;
      this._listaPedidos = listaPedidos.map((pedido: Pedido) => {
        if (pedido.dataHoraInclui)
          pedido.color = this.getOrderTimeColor(pedido.dataHoraInclui);

        console.log(
          pedido.id + "-" + pedido.dataHoraInclui + "-" + pedido.color
        );
        return pedido;
      });

      console.log(this._listaPedidos);
      const { config, status } = response;
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async listarPedidosEntregues(ped: PedidoResponse) {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const response = await apiBackEnd.get("/pedidos/listarPedidosEntregues", {
        params: {
          dataPedido: ped.dataPedido,
          funcionario: ped.funcionario,
          nomeCliente: ped.nomeCliente,
        },
      });

      this._listaPedidosEntregues = response.data;

      runInAction(() => {
        this.isLoading = false;
      });
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async alterarStatusPedido(id: number, isEntregue: boolean) {
    runInAction(() => {
      this.isLoading = true;
    });
    try {
      const response = await apiBackEnd.patch(`/pedidos/${id}`, {
        isEntregue: isEntregue,
      });
      const { config, status } = response;
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async listarFuncionarios() {
    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const response = await apiBackEnd.get("/funcionarios/listar", {
        params: { nome: "" },
      });
      let listaFuncionarios = response.data;
      runInAction(() => {
        this._listaFuncionarios = [
          { id: null, nome: null },
          ...listaFuncionarios,
        ];
      });

      console.log(this._listaFuncionarios);
      const { config, status } = response;
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  saveInfoToSearch(ped: PedidoResponse) {
    this.saveInfoSearch = ped;
  }

  get listaPedidos() {
    return this._listaPedidos;
  }

  get listaPedidosEntregues() {
    return this._listaPedidosEntregues;
  }

  get listaFuncionarios() {
    return this._listaFuncionarios;
  }

  get pedidoAtual() {
    return this.currentPedido;
  }

  get infoToSearch() {
    return this.saveInfoSearch;
  }

  getOrderTimeColor = (orderDateString: string): Color => {
    const orderDate = new Date(orderDateString);
    const currentDate = new Date();

    const diffInMilliseconds = Math.abs(
      currentDate.getTime() - orderDate.getTime()
    );

    const diffInMinutes = diffInMilliseconds / (1000 * 60);

    const limit30Min = 30;
    const limit60Min = 60;

    if (diffInMinutes > limit60Min) {
      return "red";
    }

    if (diffInMinutes > limit30Min) {
      return "yellow";
    }

    if (diffInMinutes <= limit30Min) {
      return "green";
    }

    return "default";
  };
}

export const pedidoStore = new PedidoStore();
