export interface FAQItemProps {
  question: string;
  /** Answer content. */
  children?: React.ReactNode;
  defaultOpen?: boolean;
  style?: React.CSSProperties;
}
export declare function FAQItem(props: FAQItemProps): JSX.Element;
