import { ButtonEnum, TipoOperacao } from "@/services/models";
import { Button, ButtonSizes, ButtonTheme } from "flowbite-react";

interface ButtonProps {
  operacao: ButtonEnum;
  type?: "button" | "submit" | "reset";
  handleCancelar?: (nomePage: string) => void;
  nomePage?: string;
  children: React.ReactNode;
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  operacao,
  type = "button",
  handleCancelar,
  nomePage,
  children,
}) => {
  return (
    <>
      {operacao === ButtonEnum.EDITAR && (
        <Button
          size="sm"
          type={type}
          color="blue"
          className={`btn-${operacao.toLowerCase()}`}
          outline
        >
          {children}
        </Button>
      )}
      {operacao === ButtonEnum.CRIAR && (
        <Button
          size="sm"
          type={type}
          color="green"
          className={`btn-${operacao.toLowerCase()}`}
          outline
        >
          {children}
        </Button>
      )}
      {operacao === ButtonEnum.CANCELAR && (
        <Button
          size="sm"
          type={type}
          color="red"
          className={`btn-${operacao.toLowerCase()}`}
          onClick={() => handleCancelar?.(nomePage || "")}
          outline
        >
          {children}
        </Button>
      )}
    </>
  );
};
