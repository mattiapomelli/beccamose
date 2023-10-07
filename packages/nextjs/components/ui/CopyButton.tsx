import { useState } from "react";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { Button, type ButtonProps } from "~~/components/ui/Button";

interface CopyButtonProps extends ButtonProps {
  text: string;
  onlyIcon?: boolean;
}

export const CopyButton = ({ text, onlyIcon, children, ...props }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const onCopyLink = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <Button
      {...props}
      onClick={onCopyLink}
      rightIcon={copied ? <CheckIcon className="h-5 w-5" /> : <DocumentDuplicateIcon className="h-5 w-5" />}
    >
      {onlyIcon ? null : copied ? "Copied!" : children}
    </Button>
  );
};
