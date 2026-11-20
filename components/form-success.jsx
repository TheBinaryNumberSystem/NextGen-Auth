import { CheckCircledIcon } from "@radix-ui/react-icons";

export const FormSuccess = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl flex items-center gap-x-2.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
