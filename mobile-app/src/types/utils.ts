export type ConstantValues<T extends Record<string, unknown>> = T[keyof T];
export type ConstantKeys<T extends Record<string, unknown>> = keyof T;

export type ID = string;

export type GlobalModalOptions = {
  isOpen: boolean;
  onClose: () => void;
};
