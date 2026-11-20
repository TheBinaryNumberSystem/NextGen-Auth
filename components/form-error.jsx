import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const FormError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-destructive/10 border border-destructive/20 p-3.5 rounded-xl flex items-center gap-x-2.5 text-sm text-destructive font-medium">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
