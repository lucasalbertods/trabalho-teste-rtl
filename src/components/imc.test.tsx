import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, it, expect } from 'vitest';

import IMC from './imc';

describe('IMC component', () => {
  it('Renderiza entradas e botões', () => {
    render(<IMC />);
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5');
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75');
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    expect(pesoInput).toBeInTheDocument();
    expect(alturaInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('Mostra "Abaixo do peso" para IMC < 18,5 e formata com duas casas decimais', async () => {
    render(<IMC />);
    const user = userEvent.setup();
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5') as HTMLInputElement;
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.clear(pesoInput);
    await user.type(pesoInput, '50');
    await user.clear(alturaInput);
    await user.type(alturaInput, '1.8');
    await user.click(button);

    expect(await screen.findByText(/Seu IMC é 15.43 - Abaixo do peso/)).toBeInTheDocument();
  });

  it('Classifica corretamente as categorias Peso normal, Sobrepeso e Obesidade', async () => {
    render(<IMC />);
    const user = userEvent.setup();
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5') as HTMLInputElement;
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    // Peso normal (70, 1.75) -> 22.86
    await user.clear(pesoInput);
    await user.type(pesoInput, '70');
    await user.clear(alturaInput);
    await user.type(alturaInput, '1.75');
    await user.click(button);
    expect(await screen.findByText(/Seu IMC é 22.86 - Peso normal/)).toBeInTheDocument();

    // Sobrepeso (80, 1.75) -> 26.12
    await user.clear(pesoInput);
    await user.type(pesoInput, '80');
    await user.clear(alturaInput);
    await user.type(alturaInput, '1.75');
    await user.click(button);
    expect(await screen.findByText(/Seu IMC é 26.12 - Sobrepeso/)).toBeInTheDocument();

    // Obesidade grau I (95, 1.75) -> 31.02
    await user.clear(pesoInput);
    await user.type(pesoInput, '95');
    await user.clear(alturaInput);
    await user.type(alturaInput, '1.75');
    await user.click(button);
    expect(await screen.findByText(/Seu IMC é 31.02 - Obesidade grau I/)).toBeInTheDocument();
  });

  it('Mostra obesidade grau III para IMC muito alto', async () => {
    render(<IMC />);
    const user = userEvent.setup();
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5') as HTMLInputElement;
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.clear(pesoInput);
    await user.type(pesoInput, '200');
    await user.clear(alturaInput);
    await user.type(alturaInput, '1.6');
    await user.click(button);

    expect(await screen.findByText(/Obesidade grau III/)).toBeInTheDocument();
    expect(await screen.findByText(/Seu IMC é 78.12 - Obesidade grau III/)).toBeInTheDocument();
  });

  it('Mostra erro quando o peso não é positivo', async () => {
    render(<IMC />);
    const user = userEvent.setup();
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5') as HTMLInputElement;
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.clear(pesoInput);
    await user.type(pesoInput, '0');
    await user.clear(alturaInput);
    await user.type(alturaInput, '1.7');
    await user.click(button);

    expect(await screen.findByText('O peso deve ser um valor positivo')).toBeInTheDocument();
  });

  it('Mostra erro quando a altura não é positiva', async () => {
    render(<IMC />);
    const user = userEvent.setup();
    const pesoInput = screen.getByPlaceholderText('Ex: 70.5') as HTMLInputElement;
    const alturaInput = screen.getByPlaceholderText('Ex: 1.75') as HTMLInputElement;
    const button = screen.getByRole('button', { name: /Calcular IMC/i });

    await user.clear(pesoInput);
    await user.type(pesoInput, '70');
    await user.clear(alturaInput);
    await user.type(alturaInput, '0');
    await user.click(button);

    expect(await screen.findByText('A altura deve ser um valor positivo')).toBeInTheDocument();
  });
});