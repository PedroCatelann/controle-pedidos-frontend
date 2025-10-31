export interface Funcionario {
  id?: number;
  nome: string;
  roles: Role;
}

export enum Role {
  ADMIN = "ADMIN",
  ENTREGADOR = "ENTREGADOR",
  GERENTE = "GERENTE",
}
