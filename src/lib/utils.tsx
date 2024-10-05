// Concatenar clases condicionalmente
export function cn(...inputs: (string | boolean | null | undefined)[]) {
    return inputs.filter(Boolean).join(' ');
  }
  
  // Convertir una cadena a mayúsculas
  export function toUpperCase(str: string) {
    return str.toUpperCase();
  }
  
  // Verificar si un valor es un número
  export function isNumber(value: number): boolean {
    return typeof value === 'number' && !isNaN(value);
  }
  
  // Crear un delay de espera (útil para simulaciones de carga)
  export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  