export interface CardProps {
  /** soft = quiet hairline card; sticker = 2px outline + flat offset shadow (emphasis). */
  variant?: 'soft' | 'sticker';
  /** Outline color for sticker variant. */
  accent?: 'ink' | 'orange' | 'green' | 'yellow' | 'purple' | 'blue';
  /** Lift on hover (use for clickable/featured cards). */
  hover?: boolean;
  /** CSS padding value. Default 24px. */
  padding?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
}
export declare function Card(props: CardProps): JSX.Element;
