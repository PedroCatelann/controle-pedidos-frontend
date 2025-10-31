import { apiBackEnd } from "@/services/api";
import { Funcionario } from "@/services/models";
import { AxiosError } from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";

export class FuncionarioStore {
  private currentFuncionario: Funcionario | null = null;

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
    console.log(apiBackEnd);
    try {
      const response = await apiBackEnd.post("/funcionarios", funcionario);
      const { config, status } = response;
    } catch (err) {
      const error = err as AxiosError<any>;
      throw error;
    }
  }
}

export const funcionarioStore = new FuncionarioStore();
