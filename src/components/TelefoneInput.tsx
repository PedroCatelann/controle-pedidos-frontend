"use client";

import React, { useState, useCallback } from "react";
import { Label, TextInput } from "flowbite-react";

/**
 * Função para aplicar a máscara de telefone (ex: (99) 99999-9999)
 * @param value - O valor bruto do input.
 * @returns O valor formatado.
 */
const formatPhoneNumber = (value: string): string => {
  // 1. Remove tudo que não for dígito
  const cleaned = value.replace(/\D/g, "");

  // 2. Aplica a formatação baseada no tamanho
  let formatted = "";

  if (cleaned.length > 0) {
    // Adiciona parênteses ao DDD
    formatted += `(${cleaned.substring(0, 2)}`;
  }
  if (cleaned.length > 2) {
    formatted += `) ${cleaned.substring(2, 7)}`;
  }
  if (cleaned.length > 7) {
    // Adiciona o hífen (para 9 dígitos)
    formatted += `-${cleaned.substring(7, 11)}`;
  }

  // Se for um número de 8 dígitos, ajusta o formato
  if (cleaned.length >= 10 && cleaned.length <= 10) {
    // Ex: (85) 3456-7890
    formatted = `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      6
    )}-${cleaned.substring(6, 10)}`;
  }

  return formatted;
};

export const TelefoneInput: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = event.target.value;

      // Aplica a formatação no valor
      const formattedValue = formatPhoneNumber(rawValue);

      setPhoneNumber(formattedValue);
    },
    []
  );

  return (
    <div className="max-w-md">
      <div className="mb-2 block">
        {/* Label do Flowbite */}
        <Label htmlFor="phone-input" />
      </div>

      {/* Input de Texto do Flowbite */}
      <TextInput
        id="phone-input"
        type="tel" // Usa o tipo 'tel' para melhor usabilidade em dispositivos móveis
        placeholder="(99) 99999-9999"
        required
        value={phoneNumber}
        onChange={handleChange}
        // Limita o input visualmente, mas a formatação controla o tamanho real
        maxLength={15}
      />
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Exemplo: (11) 98765-4321
      </p>
    </div>
  );
};
