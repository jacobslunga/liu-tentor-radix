import { CodeBlock } from './CodeBlock';
import { cn } from '@/lib/utils';
import type {
  ComponentProps,
  ReactNode,
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactElement,
} from 'react';
import type { Components, ExtraProps } from 'react-markdown';

type BaseProps = HTMLAttributes<HTMLElement>;
type TableProps = ComponentProps<'table'>;
type TableSectionProps = ComponentProps<'thead'>;
type TableRowProps = ComponentProps<'tr'>;
type TableCellProps = ComponentProps<'th'>;
type TableDataProps = ComponentProps<'td'>;
type HrProps = ComponentProps<'hr'>;

export const markdownComponents: Partial<Components> = {
  a: ({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      {...props}
      rel='noopener noreferrer'
      className={cn('underline underline-offset-4', className)}
    />
  ),

  pre: (props: HTMLAttributes<HTMLPreElement> & ExtraProps) => {
    const { children } = props;
    const child = children as ReactElement<{
      className?: string;
      children?: ReactNode;
    }>;
    return (
      <CodeBlock className={child?.props?.className}>
        {child?.props?.children}
      </CodeBlock>
    );
  },

  code: ({ children, ...props }: HTMLAttributes<HTMLElement> & ExtraProps) => {
    const isInline = !props.className?.includes('language-');
    if (isInline) {
      return (
        <code className='bg-muted/50 text-foreground px-1 py-0.5 rounded text-base'>
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },

  p: ({ className, ...props }: BaseProps) => (
    <p {...props} className={cn('my-2 text-base', className)} />
  ),
  ul: ({ className, ...props }: BaseProps) => (
    <ul {...props} className={cn('my-2 ml-4 list-disc text-base', className)} />
  ),
  ol: ({ className, ...props }: BaseProps) => (
    <ol
      {...props}
      className={cn('my-2 ml-4 list-decimal text-base', className)}
    />
  ),
  li: ({ className, ...props }: BaseProps) => (
    <li {...props} className={cn('my-1 text-base', className)} />
  ),
  h1: ({ className, ...props }: BaseProps) => (
    <h1
      {...props}
      className={cn('mt-4 mb-2 text-xl font-semibold', className)}
    />
  ),
  h2: ({ className, ...props }: BaseProps) => (
    <h2
      {...props}
      className={cn('mt-3 mb-2 text-lg font-semibold', className)}
    />
  ),
  h3: ({ className, ...props }: BaseProps) => (
    <h3
      {...props}
      className={cn('mt-2 mb-1 text-base font-semibold', className)}
    />
  ),
  hr: ({ className, ...props }: HrProps) => (
    <hr {...props} className={cn('my-4 border-border/60', className)} />
  ),
  table: ({ className, ...props }: TableProps) => (
    <div className='my-4 w-full overflow-x-auto rounded-3xl border border-border/60 bg-card/70 shadow-sm backdrop-blur-sm'>
      <table
        {...props}
        className={cn(
          'w-full border-separate border-spacing-0 text-left text-[13px] leading-5',
          className,
        )}
      />
    </div>
  ),
  thead: ({ className, ...props }: TableSectionProps) => (
    <thead
      {...props}
      className={cn(
        'bg-muted/35 text-[11px] uppercase tracking-[0.08em] text-muted-foreground [&_tr]:border-b [&_tr]:border-border/50',
        className,
      )}
    />
  ),
  tbody: ({ className, ...props }: TableSectionProps) => (
    <tbody
      {...props}
      className={cn(
        '[&_tr:last-child]:border-0 [&_tr:last-child_td]:border-b-0',
        className,
      )}
    />
  ),
  tr: ({ className, ...props }: TableRowProps) => (
    <tr
      {...props}
      className={cn(
        'transition-colors odd:bg-background/40 even:bg-muted/10 hover:bg-muted/20',
        className,
      )}
    />
  ),
  th: ({ className, ...props }: TableCellProps) => (
    <th
      {...props}
      className={cn(
        'border-b border-border/50 px-3 py-2.5 text-left align-middle text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground first:pl-4 last:pr-4',
        className,
      )}
    />
  ),
  td: ({ className, ...props }: TableDataProps) => (
    <td
      {...props}
      className={cn(
        'border-b border-border/40 px-3 py-2 align-top text-[13px] text-foreground/90 first:pl-4 last:pr-4',
        className,
      )}
    />
  ),
};
