/**
 * @startingPoint section="Components" subtitle="Pill button with candy-edge press states" viewport="700x260"
 */
export interface ButtonProps {
  /** Visual style. solid = filled with candy edge; ghost = 2px ink outline. */
  variant?: 'solid' | 'ghost';
  /** Brand color for solid buttons. "wa" is reserved for WhatsApp CTAs. */
  color?: 'orange' | 'wa' | 'green' | 'purple' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  /** Renders an <a> instead of <button>. */
  href?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (e: any) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
