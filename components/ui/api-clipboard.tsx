import { LuCopy, LuServer } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ApiClipboard = {
  title: string;
  text: string;
  variant: "public" | "admin";
};

const badgeOptions = {
  public: "Public",
  admin: "Admin",
} satisfies Record<ApiClipboard["variant"], "Public" | "Admin">;

const variantOptions = {
  public: "success",
  admin: "default",
} satisfies Record<ApiClipboard["variant"], React.ComponentProps<typeof Badge>["variant"]>;

export const ApiClipboard: React.FC<ApiClipboard> = (props) => {
  const { title, text, variant = "public" } = props;

  const onCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard.");
  };

  return (
    <div className="px-3 py-2 rounded bg-card text-card-foreground border shadow-sm flex flex-col gap-y-2">
      <div className="flex items-center gap-x-2 py-1">
        <LuServer />
        <p className="text-sm font-semibold tracking-wide">{title}</p>
        <Badge variant={variantOptions[variant]}>{badgeOptions[variant]}</Badge>
      </div>
      <Separator />
      <div className="flex justify-between items-center bg-muted rounded gap-x-2 px-2 md:px-3 lg:px-4 py-2">
        <code className="text-sm overflow-x-auto">{text}</code>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onCopy(text)}
          className="hover:bg-border dark:hover:bg-popover"
        >
          <LuCopy />
        </Button>
      </div>
    </div>
  );
};
