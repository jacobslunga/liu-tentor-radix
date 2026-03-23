import { CodeBlock } from "./CodeBlock";
import { cn } from "@/lib/utils";
import type { ReactNode, ReactElement } from "react";
import type { Components } from "react-markdown";

export const markdownComponents: Partial<Components> = {
  a: ({ className, node, ...props }: any) => (
    <a
      {...props}
      rel="noopener noreferrer"
      className={cn("underline underline-offset-4", className)}
    />
  ),

  pre: ({ node, ...props }: any) => {
    const { children } = props;
    const child = children as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;
    return (
      <div className="animate-stream-block">
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
        <code className="bg-muted/50 text-foreground px-1.5 py-0.5 rounded text-[1.03rem]">
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
        "animate-stream-block my-2 text-pretty wrap-break-word",
        className,
      )}
    />
  ),

  ul: ({ className, node, ...props }: any) => (
    <ul
      {...props}
      className={cn(
        "animate-stream-block my-2 ml-6 list-disc text-pretty wrap-break-word",
        className,
      )}
    />
  ),

  ol: ({ className, node, ...props }: any) => (
    <ol
      {...props}
      className={cn(
        "animate-stream-block my-2 ml-6 list-decimal text-pretty wrap-break-word",
        className,
      )}
    />
  ),

  li: ({ className, node, ...props }: any) => (
    <li
      {...props}
      className={cn(
        "animate-stream-block text-pretty wrap-break-word",
        className,
      )}
    />
  ),

  h1: ({ className, node, ...props }: any) => (
    <h1 {...props} className={cn("animate-stream-block", className)} />
  ),

  h2: ({ className, node, ...props }: any) => (
    <h2 {...props} className={cn("animate-stream-block", className)} />
  ),

  h3: ({ className, node, ...props }: any) => (
    <h3 {...props} className={cn("animate-stream-block", className)} />
  ),

  hr: ({ className, node, ...props }: any) => (
    <hr {...props} className={cn("border-foreground!", className)} />
  ),

  br: ({ className, node, ...props }: any) => (
    <br {...props} className={cn("border-foreground!", className)} />
  ),

  table: ({ className, node, ...props }: any) => (
    <div className="animate-stream-block mt-5 mb-3 w-full overflow-x-auto overflow-y-hidden rounded-lg border border-border bg-card">
      <table
        {...props}
        className={cn(
          "min-w-full mt-0 border-collapse text-left text-sm text-pretty",
          className,
        )}
      />
    </div>
  ),

  thead: ({ className, node, ...props }: any) => (
    <thead
      {...props}
      className={cn("bg-muted/30 text-muted-foreground", className)}
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
