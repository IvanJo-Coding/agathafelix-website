export interface SectionHeaderProps {
  /** Eyebrow Badge text, e.g. "Produk Kami". */
  eyebrow?: string;
  eyebrowColor?: 'orange' | 'green' | 'yellow' | 'purple' | 'blue' | 'ink';
  title: string;
  /** Substring of title rendered in a brand color (max one per heading). */
  highlight?: string;
  highlightColor?: 'orange' | 'green' | 'yellow' | 'purple' | 'blue';
  description?: string;
  align?: 'center' | 'left';
  style?: React.CSSProperties;
}
export declare function SectionHeader(props: SectionHeaderProps): JSX.Element;
