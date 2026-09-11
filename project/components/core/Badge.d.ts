export interface BadgeProps {
  /** Soft-fill brand color. Cycle orange → green → yellow → purple → blue down a page. */
  color?: 'orange' | 'green' | 'yellow' | 'purple' | 'blue' | 'ink';
  /** Leading colored dot. */
  dot?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
