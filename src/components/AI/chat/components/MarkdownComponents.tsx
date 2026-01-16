import { CodeBlock } from "./CodeBlock";

export const markdownComponents = {
  a: (props: any) => (
    <a {...props} rel="noopener noreferrer" className="underline" />
  ),

  pre: ({ children }: any) => {
    const child = children?.props;
    return (
      <CodeBlock className={child?.className}>{child?.children}</CodeBlock>
    );
  },

  code: ({ inline, children }: any) => {
    if (inline) {
      return (
        <code className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-base">
          {children}
        </code>
      );
    }
    return null;
  },

  p: (props: any) => <p {...props} className="my-2 text-base font-medium" />,
  ul: (props: any) => (
    <ul {...props} className="my-2 ml-4 list-disc text-base" />
  ),
  ol: (props: any) => (
    <ol {...props} className="my-2 ml-4 list-decimal text-base" />
  ),
  li: (props: any) => <li {...props} className="my-1 text-base" />,
  h1: (props: any) => <h1 {...props} className="text-xl font-bold mt-4 mb-2" />,
  h2: (props: any) => <h2 {...props} className="text-lg font-bold mt-3 mb-2" />,
  h3: (props: any) => (
    <h3 {...props} className="text-base font-bold mt-2 mb-1" />
  ),
};
