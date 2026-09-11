export interface InputProps {
  label?: string;
  hint?: string;
  /** Error message — replaces hint, turns the border orange. */
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  type?: string;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;

export interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  /** Simple string options; or pass <option> children instead. */
  options?: string[];
  value?: string;
  onChange?: (e: any) => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;

export interface TextareaProps {
  label?: string;
  hint?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: any) => void;
  rows?: number;
  style?: React.CSSProperties;
}
export declare function Textarea(props: TextareaProps): JSX.Element;
