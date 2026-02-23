import type { ComponentPropsWithoutRef, ComponentType } from 'react';
import { shouldUseWhiteImageBg } from '@/lib/imagePresentation';
import { uiTextStyles } from '@/lib/ui';

type MDXComponentMap = Record<string, ComponentType<Record<string, unknown>>>;

function H2(props: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2
      className="text-2xl md:text-3xl font-bold mt-12 mb-4 font-display text-slate-900 dark:text-white"
      {...props}
    />
  );
}

function H3(props: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      className="text-xl md:text-2xl font-semibold mt-10 mb-3 font-display text-slate-900 dark:text-white"
      {...props}
    />
  );
}

function H4(props: ComponentPropsWithoutRef<'h4'>) {
  return <h4 className="text-lg font-semibold mt-8 mb-2 text-cyan-600 dark:text-cyan-300" {...props} />;
}

function P(props: ComponentPropsWithoutRef<'p'>) {
  return <p className={uiTextStyles.bodyParagraph} {...props} />;
}

function UL(props: ComponentPropsWithoutRef<'ul'>) {
  return (
    <ul
      className={`${uiTextStyles.bodyList} ml-2`}
      {...props}
    />
  );
}

function OL(props: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol
      className={`${uiTextStyles.bodyListOrdered} ml-2`}
      {...props}
    />
  );
}

function LI(props: ComponentPropsWithoutRef<'li'>) {
  return <li className={uiTextStyles.bodyListItem} {...props} />;
}

function Blockquote(props: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote className={uiTextStyles.blockquote} {...props} />
  );
}

function HR() {
  return <hr className="border-white/10 my-10" />;
}

function Strong(props: ComponentPropsWithoutRef<'strong'>) {
  return <strong className={uiTextStyles.strong} {...props} />;
}

function Em(props: ComponentPropsWithoutRef<'em'>) {
  return <em className={uiTextStyles.emphasis} {...props} />;
}

function A(props: ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className={uiTextStyles.link}
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  );
}

function Code(props: ComponentPropsWithoutRef<'code'>) {
  const { className, ...rest } = props;
  if (className && className.includes('language-')) {
    return <code className={className} {...rest} />;
  }
  return (
    <code
      className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-600 dark:text-cyan-200 text-sm font-mono"
      {...rest}
    />
  );
}

function Pre(props: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre
      className="rounded-lg bg-black/40 border border-white/10 p-4 overflow-x-auto my-6 text-sm"
      {...props}
    />
  );
}

function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse text-sm" {...props} />
    </div>
  );
}

function TH(props: ComponentPropsWithoutRef<'th'>) {
  return (
    <th
      className="border border-white/10 px-4 py-2 text-left font-semibold text-cyan-600 dark:text-cyan-200 bg-white/5"
      {...props}
    />
  );
}

function TD(props: ComponentPropsWithoutRef<'td'>) {
  return <td className={`border border-white/10 px-4 py-2 ${uiTextStyles.body}`} {...props} />;
}

function Img(props: ComponentPropsWithoutRef<'img'>) {
  const { className, alt = '', ...rest } = props;
  const useWhiteBg = shouldUseWhiteImageBg(props.src);
  return (
    <img
      alt={alt}
      className={`block max-w-full h-auto rounded-[1.25rem] my-6 mx-auto ${
        useWhiteBg ? 'bg-white ' : ''
      }${className || ''}`.trim()}
      loading={props.loading ?? 'lazy'}
      {...rest}
    />
  );
}

export const mdxComponents: MDXComponentMap = {
  h2: H2,
  h3: H3,
  h4: H4,
  p: P,
  ul: UL,
  ol: OL,
  li: LI,
  blockquote: Blockquote,
  hr: HR,
  strong: Strong,
  em: Em,
  a: A,
  code: Code,
  pre: Pre,
  table: Table,
  th: TH,
  td: TD,
  img: Img,
};
