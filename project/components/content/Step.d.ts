export interface StepProps {
  num: number | string;
  title: string;
  /** Step description text. */
  children?: React.ReactNode;
  color?: 'orange' | 'green' | 'purple' | 'blue';
  style?: React.CSSProperties;
}
export declare function Step(props: StepProps): JSX.Element;
