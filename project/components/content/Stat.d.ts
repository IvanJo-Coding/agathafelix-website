export interface StatProps {
  /** The big number, e.g. "20M+", "500+", "5–14 hari". */
  value: string;
  label: string;
  color?: 'orange' | 'green' | 'yellow' | 'purple' | 'blue' | 'ink';
  style?: React.CSSProperties;
}
export declare function Stat(props: StatProps): JSX.Element;
