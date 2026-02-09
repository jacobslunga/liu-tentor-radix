import { CodeBlock } from "./CodeBlock";
import type {
  ReactNode,
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactElement,
} from "react";
import type { Components, ExtraProps } from "react-markdown";

type BaseProps = HTMLAttributes<HTMLElement>;

export const markdownComponents: Partial<Components> = {
  a: (props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props} rel="noopener noreferrer" className="underline" />
  ),

  pre: (props: HTMLAttributes<HTMLPreElement> & ExtraProps) => {
    const { children } = props;
    const child = children as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;
    return (
      <div className="overflow-x-auto max-w-full">
        <CodeBlock className={child?.props?.className}>
          {child?.props?.children}
        </CodeBlock>
      </div>
    );
  },

  code: ({ children, ...props }: HTMLAttributes<HTMLElement> & ExtraProps) => {
    const isInline = !props.className?.includes("language-");
    if (isInline) {
      return (
        <code className="bg-muted/50 text-foreground px-1 py-0.5 rounded text-base break-all">
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },

  p: (props: BaseProps) => (
    <p {...props} className="my-2 text-base wrap-break-word" />
  ),
  ul: (props: BaseProps) => (
    <ul {...props} className="my-2 ml-4 list-disc text-base wrap-break-word" />
  ),
  ol: (props: BaseProps) => (
    <ol
      {...props}
      className="my-2 ml-4 list-decimal text-base wrap-break-word"
    />
  ),
  li: (props: BaseProps) => (
    <li {...props} className="my-1 text-base wrap-break-word" />
  ),
  h1: (props: BaseProps) => (
    <h1 {...props} className="text-xl font-semibold mt-4 mb-2" />
  ),
  h2: (props: BaseProps) => (
    <h2 {...props} className="text-lg font-semibold mt-3 mb-2" />
  ),
  h3: (props: BaseProps) => (
    <h3 {...props} className="text-base font-semibold mt-2 mb-1" />
  ),
};
