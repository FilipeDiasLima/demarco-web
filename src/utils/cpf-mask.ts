export const cpfMask = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");

  const masked = cleaned
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{2})$/, "$1-$2");

  return masked;
};

export const unmaskCPF = (value: string): string => {
  return value.replace(/\D/g, "");
};
