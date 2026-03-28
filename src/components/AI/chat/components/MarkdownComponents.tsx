import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import type { ReactNode, ReactElement } from "react";
import type { Components } from "react-markdown";

export const markdownComponents: Partial<Components> = {
  a: ({ className, node, ...props }: any) => (
    <a
      {...props}
      rel="noopener noreferrer"
      className={cn(
        "text-primary underline underline-offset-2 hover:opacity-75 transition-opacity",
        className,
      )}
    />
  ),

  pre: ({ node, ...props }: any) => {
    const { children } = props;
    const child = children as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;
    return (
      <div className="animate-stream-block my-3">
        <CodeBlock className={child?.props?.className}>
          {child?.props?.children}
        </CodeBlock>
      </div>
    );
  },

  code: ({ node, children, className, ...props }: any) => {
    const isInline = !className?.includes("language-");
    if (isInline) {
      return (
        <code className="bg-muted text-foreground/90 px-1 py-px rounded-sm text-[0.875em] font-mono">
          {children}
        </code>
      );
    }
    return (
      <code {...props} className={className}>
        {children}
      </code>
    );
  },

  p: ({ className, node, ...props }: any) => (
    <p
      {...props}
      className={cn(
        "animate-stream-block my-2 font-normal text-base leading-relaxed text-pretty wrap-break-word",
        className,
      )}
    />
  ),

  ul: ({ className, node, ...props }: any) => (
    <ul
      {...props}
      className={cn(
        "animate-stream-block my-2 ml-5 list-disc text-base leading-relaxed text-pretty wrap-break-word space-y-0.5",
        className,
      )}
    />
  ),

  ol: ({ className, node, ...props }: any) => (
    <ol
      {...props}
      className={cn(
        "animate-stream-block my-2 ml-5 list-decimal text-base leading-relaxed text-pretty wrap-break-word space-y-0.5",
        className,
      )}
    />
  ),

  li: ({ className, node, ...props }: any) => (
    <li
      {...props}
      className={cn(
        "animate-stream-block text-base text-pretty wrap-break-word [&::marker]:text-foreground [&::marker]:font-bold",
        className,
      )}
    />
  ),

  h1: ({ className, node, ...props }: any) => (
    <h1
      {...props}
      className={cn(
        "animate-stream-block font-medium text-xl leading-snug mt-6 mb-2",
        className,
      )}
    />
  ),

  h2: ({ className, node, ...props }: any) => (
    <h2
      {...props}
      className={cn(
        "animate-stream-block font-medium text-lg leading-snug mt-5 mb-1.5",
        className,
      )}
    />
  ),

  h3: ({ className, node, ...props }: any) => (
    <h3
      {...props}
      className={cn(
        "animate-stream-block font-semibold text-[1.0625rem] leading-snug mt-4 mb-1",
        className,
      )}
    />
  ),

  hr: ({ className, node, ...props }: any) => (
    <hr {...props} className={cn("my-5 border-foreground/40!", className)} />
  ),

  br: ({ className, node, ...props }: any) => (
    <br {...props} className={cn(className)} />
  ),

  blockquote: ({ className, node, ...props }: any) => (
    <blockquote
      {...props}
      className={cn(
        "animate-stream-block border-l-2 border-border pl-3 my-3 text-muted-foreground text-[0.9375rem] italic",
        className,
      )}
    />
  ),

  table: ({ className, node, ...props }: any) => (
    <div className="animate-stream-block mt-4 mb-3 w-full overflow-x-auto overflow-y-hidden rounded-lg border border-border bg-card">
      <table
        {...props}
        className={cn(
          "min-w-full mt-0 border-collapse text-left text-[0.875rem] text-pretty",
          className,
        )}
      />
    </div>
  ),

  thead: ({ className, node, ...props }: any) => (
    <thead
      {...props}
      className={cn(
        "bg-muted/30 text-muted-foreground text-xs font-semibold uppercase tracking-wide",
        className,
      )}
    />
  ),

  tbody: ({ className, node, ...props }: any) => (
    <tbody
      {...props}
      className={cn(
        "[&_tr:last-child]:border-b-0 [&_tr:last-child_td]:border-b-0",
        className,
      )}
    />
  ),

  tr: ({ className, node, ...props }: any) => (
    <tr
      {...props}
      className={cn(
        "animate-stream-block border-b border-border/50 transition-colors hover:bg-muted/10",
        className,
      )}
    />
  ),

  th: ({ className, node, ...props }: any) => (
    <th
      {...props}
      className={cn(
        "px-3 py-2 text-left align-middle whitespace-nowrap",
        className,
      )}
    />
  ),

  td: ({ className, node, ...props }: any) => (
    <td
      {...props}
      className={cn(
        "px-3 py-2 align-top text-foreground/90 first:whitespace-nowrap",
        className,
      )}
    />
  ),
};
