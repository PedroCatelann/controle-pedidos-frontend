import { apiBackEnd } from "@/services/api";
import {
  Funcionario,
  Pedido,
  PedidoRequest,
  PedidoResponse,
} from "@/services/models";
import { AxiosError } from "axios";
import { action, makeAutoObservable, observable } from "mobx";

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
    this.isLoading = true;
    try {
      const response = await apiBackEnd.post("/pedidos", Pedido);
      const { config, status } = response;
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async editarPedido(id: number, Pedido: Pedido) {
    this.isLoading = true;
    console.log(Pedido);
    try {
      const response = await apiBackEnd.put(`/pedidos`, Pedido);
      const { config, status } = response;
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async getPedido(id: number) {
    this.isLoading = true;

    try {
      const response = await apiBackEnd.get(`/pedidos/${id}`);
      this.currentPedido = response.data;
      console.log(this.currentPedido);
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async deletePedido(id: number) {
    this.isLoading = true;

    try {
      await apiBackEnd.delete(`/pedidos/${id}`);
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async listarPedidos(ped: PedidoResponse) {
    this.isLoading = true;

    try {
      const response = await apiBackEnd.get("/pedidos/listar", {
        params: {
          dataPedido: ped.dataPedido,
          funcionario: ped.funcionario,
          nomeCliente: ped.nomeCliente,
        },
      });
      let listaTodosPedidos = response.data;

      this._listaPedidos = listaTodosPedidos.filter(
        (p: Pedido) => p.isEntregue === false
      );
      this._listaPedidosEntregues = listaTodosPedidos.filter(
        (p: Pedido) => p.isEntregue === true
      );

      console.log(this._listaPedidos);
      const { config, status } = response;
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async alterarStatusPedido(id: number, isEntregue: boolean) {
    this.isLoading = true;
    try {
      const response = await apiBackEnd.patch(`/pedidos/${id}`, {
        isEntregue: isEntregue,
      });
      const { config, status } = response;
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async listarFuncionarios() {
    this.isLoading = true;

    try {
      const response = await apiBackEnd.get("/funcionarios/listar", {
        params: { nome: "" },
      });
      this._listaFuncionarios = response.data;
      console.log(this._listaFuncionarios);
      const { config, status } = response;
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

  get listaFuncionarios() {
    return this._listaFuncionarios;
  }

  get PedidoAtual() {
    return this.currentPedido;
  }

  get infoToSearch() {
    return this.saveInfoSearch;
  }
}

export const pedidoStore = new PedidoStore();
