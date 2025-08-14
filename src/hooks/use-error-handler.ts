import { toast } from "sonner";

export function useErrorHandler() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any, customMessage?: string) => {
    const message =
      customMessage ||
      error?.response?.data?.message ||
      error?.message ||
      "Ocorreu um erro inesperado";

    toast.error(message);

    console.error("Error:", error);
  };

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  return { handleError, handleSuccess };
}
