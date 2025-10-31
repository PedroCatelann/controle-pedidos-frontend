import { apiBackEnd } from "@/services/api";
import { Funcionario } from "@/services/models";
import { AxiosError } from "axios";
import { action, makeAutoObservable, observable, runInAction } from "mobx";

export class FuncionarioStore {
  private currentFuncionario: Funcionario | null = null;

  private isLoading: boolean = false;

  public responseData = {
    typeRequest: "",
    statusRequest: 0,
  };

  constructor() {
    // 3. Torna todas as propriedades e métodos na classe
    // observáveis e actions automaticamente (exceto o constructor).
    makeAutoObservable(this);
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

    const { config, status } = await apiBackEnd.post(
      "/funcionarios",
      funcionario
    );
    const response = await fetch("/funcionarios", {
      method: "POST",
      body: JSON.stringify(funcionario),
    })
      .then(() => {
        runInAction(() => {
          this.responseData = {
            typeRequest: config.method || "",
            statusRequest: status,
          };
          this.isLoading = false;
        });
      })
      .catch((err) => {
        const error = err as AxiosError<any>;
        throw error;
      });
  }
}
