export interface Funcionario {
  id?: number;
  nome: string;
  roles: Role;
}

export interface FuncionarioResponse {
  nome?: string;
}

export enum Role {
  ADMIN = "ADMIN",
  ENTREGADOR = "ENTREGADOR",
  GERENTE = "GERENTE",
}

export enum TipoOperacao {
  CRIAR = "criar",
  EDITAR = "editar",
  VISUALIZAR = "visualizar",
}

export enum ButtonEnum {
  EDITAR = "EDITAR",
  CRIAR = "CRIAR",
  CANCELAR = "CANCELAR",
}
