// CustomSpinner.tsx
import React from "react";

// Tipagem para as props
interface CustomSpinnerProps {
  /** Cor da borda do spinner (ex: 'border-blue-500'). Deve usar o prefixo 'border-'. */
  color?: string;
  /** Tamanho do spinner (ex: 'w-12 h-12') */
  size?: string;
  /** Espessura da borda (ex: 'border-8') */
  thickness?: string;
  isLoading: boolean;
}

const CustomSpinner: React.FC<CustomSpinnerProps> = ({
  color = "border-white-500",
  size = "w-12 h-12",
  thickness = "border-4",
  isLoading,
}) => {
  if (!isLoading) return null;

  // 1. Classes do Spinner (O elemento que gira)
  const spinnerClasses = `
    ${size} 
    ${thickness} 
    ${color}
    animate-spin 
    ease-linear 
    rounded-full 
    border-t-transparent 
    border-solid
  `;
  const overlayClasses = "fixed inset-0 z-50 flex items-center justify-center";

  return (
    // Div de Overlay (Escurece, Desfoca e Centraliza)
    <div
      className={overlayClasses}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      {/* O elemento do Spinner (O que gira) */}
      <div className={spinnerClasses} role="status">
        <span className="sr-only">Carregando...</span>
      </div>
    </div>
  );
};

export default CustomSpinner;
