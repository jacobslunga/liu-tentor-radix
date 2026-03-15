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
type BrProps = ComponentProps<'br'>;

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
        <code className='bg-muted/50 text-foreground px-1.5 py-0.5 rounded text-[1.03rem]'>
          {children}
        </code>
      );
    }
    return <code {...props}>{children}</code>;
  },

  p: ({ className, ...props }: BaseProps) => (
    <p
      {...props}
      className={cn(
        'my-2 text-[1.08rem] leading-8 text-pretty wrap-break-word',
        className,
      )}
    />
  ),
  ul: ({ className, ...props }: BaseProps) => (
    <ul
      {...props}
      className={cn(
        'my-2 ml-5 list-disc text-[1.08rem] leading-8 text-pretty wrap-break-word',
        className,
      )}
    />
  ),
  ol: ({ className, ...props }: BaseProps) => (
    <ol
      {...props}
      className={cn(
        'my-2 ml-5 list-decimal text-[1.08rem] leading-8 text-pretty wrap-break-word',
        className,
      )}
    />
  ),
  li: ({ className, ...props }: BaseProps) => (
    <li
      {...props}
      className={cn(
        'my-1 text-[1.08rem] leading-8 text-pretty wrap-break-word',
        className,
      )}
    />
  ),
  h1: ({ className, ...props }: BaseProps) => (
    <h1
      {...props}
      className={cn('mt-4 mb-2 text-2xl font-semibold leading-tight', className)}
    />
  ),
  h2: ({ className, ...props }: BaseProps) => (
    <h2
      {...props}
      className={cn('mt-3 mb-2 text-xl font-semibold leading-tight', className)}
    />
  ),
  h3: ({ className, ...props }: BaseProps) => (
    <h3
      {...props}
      className={cn('mt-2 mb-1 text-lg font-medium leading-snug', className)}
    />
  ),
  hr: ({ className, ...props }: HrProps) => (
    <hr {...props} className={cn('my-4 bg-foreground', className)} />
  ),
  br: ({ className, ...props }: BrProps) => (
    <br {...props} className={cn('my-4 bg-foreground', className)} />
  ),
  table: ({ className, ...props }: TableProps) => (
    <div className='my-3 w-full overflow-hidden rounded-4xl border border-border/50 bg-card shadow-sm'>
      <table
        {...props}
        className={cn(
          'w-full border-collapse text-left text-[1.01rem] leading-7 wrap-anywhere',
          className,
        )}
      />
    </div>
  ),
  thead: ({ className, ...props }: TableSectionProps) => (
    <thead {...props} className={cn('text-muted-foreground', className)} />
  ),
  tbody: ({ className, ...props }: TableSectionProps) => (
    <tbody
      {...props}
      className={cn(
        '[&_tr:last-child]:border-b-0 [&_tr:last-child_td]:border-b-0',
        className,
      )}
    />
  ),
  tr: ({ className, ...props }: TableRowProps) => (
    <tr
      {...props}
      className={cn(
        'border-b border-border/35 transition-colors hover:bg-muted/8',
        className,
      )}
    />
  ),
  th: ({ className, ...props }: TableCellProps) => (
    <th
      {...props}
      className={cn(
        'px-6 py-4 text-left align-middle text-[1.03rem] font-semibold whitespace-nowrap first:pl-8 last:pr-8',
        className,
      )}
    />
  ),
  td: ({ className, ...props }: TableDataProps) => (
    <td
      {...props}
      className={cn(
        'px-6 py-4 align-top text-[1.01rem] text-foreground/90 first:pl-8 last:pr-8',
        className,
      )}
    />
  ),
};
