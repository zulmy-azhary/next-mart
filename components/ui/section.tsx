export const SectionHeader: React.FC<
  React.ComponentProps<"div"> & { children: React.ReactNode }
> = (props) => {
  const { children, ...rest } = props;
  return (
    <div {...rest} className="flex justify-between items-center">
      {children}
    </div>
  );
};

export const SectionContent: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <>{children}</>;
};

export const Section: React.FC<
  React.ComponentProps<"section"> & {
    children: React.ReactNode;
  }
> = (props) => {
  const { children, ...rest } = props;
  return (
    <section {...rest} className="flex flex-col gap-y-8">
      {children}
    </section>
  );
};
