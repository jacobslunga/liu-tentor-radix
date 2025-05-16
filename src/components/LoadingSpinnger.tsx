import { LogoIcon } from "./LogoIcon";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <LogoIcon className="w-12 h-12 stroke-foreground/30 dark:stroke-foreground/30 animate-spinEase" />
    </div>
  );
}
