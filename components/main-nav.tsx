"use client";

import { cn } from "@/lib/utils";
import { useToggle } from "@/providers/toggle.provider";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

type MainNavProps = React.ComponentProps<"nav">;

const isActive = (pathname: string, id: string | string[], path?: string) => {
  return path ? pathname === `/${id}/${path}` || pathname.includes(path) : pathname === `/${id}`;
};

export const MainNav: React.FC<MainNavProps> = (props) => {
  const { className, ...rest } = props;

  const { onClose } = useToggle();
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Overview",
      active: isActive(pathname, params.storeId),
    },
    {
      href: `/${params.storeId}/billboards`,
      label: "Billboards",
      active: isActive(pathname, params.storeId, "billboards"),
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categories",
      active: isActive(pathname, params.storeId, "categories"),
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Sizes",
      active: isActive(pathname, params.storeId, "sizes"),
    },
    {
      href: `/${params.storeId}/colors`,
      label: "Colors",
      active: isActive(pathname, params.storeId, "colors"),
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      active: isActive(pathname, params.storeId, "settings"),
    },
  ];

  return (
    <nav
      className={cn(
        "flex flex-col gap-y-4 lg:flex-row items-start lg:items-center lg:gap-x-4 xl:gap-x-6",
        className
      )}
      {...rest}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
          onClick={onClose}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};
