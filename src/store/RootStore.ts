import { CounterStore } from "./CounterStore";
import { FuncionarioStore } from "./FuncionarioStore";

export class RootStore {
  funcionarioStore = new FuncionarioStore();
  counterStore = new CounterStore();
}
