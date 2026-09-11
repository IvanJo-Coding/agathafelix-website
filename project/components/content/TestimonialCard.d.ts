export interface TestimonialCardProps {
  /** Quote text WITHOUT surrounding quotes (added automatically). */
  quote: string;
  /** Indonesian honorific style: "Bu Rahma Susanti", "Pak Andri Setiawan". */
  name: string;
  /** Role + institution: "Kepala Sekolah, SDN 04 Bekasi". */
  role: string;
  /** Index into the brand avatar color cycle (0–3). */
  avatarColor?: number;
  style?: React.CSSProperties;
}
export declare function TestimonialCard(props: TestimonialCardProps): JSX.Element;
