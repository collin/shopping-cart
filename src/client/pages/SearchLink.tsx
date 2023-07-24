import { Link, LinkProps, useSearchParams } from "react-router-dom";

export const SearchLink = ({
  children,
  updates,
  ...props
}: {
  children: React.ReactNode;
  updates: Record<string, any>;
} & Omit<LinkProps, "to">) => {
  const [params] = useSearchParams();

  const linkParams = new URLSearchParams(params.toString());
  for (const [key, value] of Object.entries(updates)) {
    linkParams.set(key, value);
  }

  return (
    <Link to={{ search: linkParams.toString() }} {...props}>
      {children}
    </Link>
  );
};
