import { apiBackEnd } from "@/services/api";
import { Funcionario, FuncionarioResponse } from "@/services/models";
import { AxiosError } from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";

export class FuncionarioStore {
  private currentFuncionario: Funcionario | null = null;
  private _listaFuncionarios: Funcionario[] = [];
  private saveInfoSearch: FuncionarioResponse | null = null;
  isLoading: boolean = false;

  public responseData = {
    typeRequest: "",
    statusRequest: 0,
  };

  constructor() {
    // 3. Torna todas as propriedades e métodos na classe
    // observáveis e actions automaticamente (exceto o constructor).
    makeAutoObservable(this, {
      isLoading: observable,
      incluirFuncionario: action,
      clean: action,
    });
  }

  clean() {
    this.currentFuncionario = null;
    this.isLoading = false;
    this.responseData = {
      typeRequest: "",
      statusRequest: 0,
    };
  }

  async incluirFuncionario(funcionario: Funcionario) {
    this.isLoading = true;
    try {
      const response = await apiBackEnd.post("/funcionarios", funcionario);
      const { config, status } = response;
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async editarFuncionario(id: number, funcionario: Funcionario) {
    this.isLoading = true;
    console.log(funcionario);
    try {
      const response = await apiBackEnd.put(`/funcionarios`, funcionario);
      const { config, status } = response;
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async getFuncionario(id: number) {
    this.isLoading = true;

    try {
      const response = await apiBackEnd.get(`/funcionarios/${id}`);
      this.currentFuncionario = response.data;
      console.log(this.currentFuncionario);
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async deleteFuncionario(id: number) {
    this.isLoading = true;

    try {
      await apiBackEnd.delete(`/funcionarios/${id}`);
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  async listarFuncionarios(func: FuncionarioResponse) {
    this.isLoading = true;

    try {
      const response = await apiBackEnd.get("/funcionarios/listar", {
        params: {
          nome: func.nome,
        },
      });
      this._listaFuncionarios = response.data;
      console.log(this._listaFuncionarios);
      const { config, status } = response;
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }

  saveInfoToSearch(func: FuncionarioResponse) {
    this.saveInfoSearch = func;
  }

  get listaFuncionarios() {
    return this._listaFuncionarios;
  }

  get funcionarioAtual() {
    return this.currentFuncionario;
  }

  get infoToSearch() {
    return this.saveInfoSearch;
  }
}

export const funcionarioStore = new FuncionarioStore();
