declare module '*.mdx' {
  let MDXComponent: (props: Record<string, unknown>) => JSX.Element;
  export default MDXComponent;
}

declare global {
  namespace JSX {
    type Element = astroHTML.JSX.Element;
    type IntrinsicAttributes = astroHTML.JSX.IntrinsicAttributes;
    type IntrinsicElements = astroHTML.JSX.IntrinsicElements;
  }
}

export {};
