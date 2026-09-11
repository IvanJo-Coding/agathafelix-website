export interface ProductCardProps {
  /** Small uppercase tag, e.g. "Standar", "Premium", "Best Seller". */
  tag?: string;
  title: string;
  description: string;
  /** Product photo URL — fills the media area. */
  image?: string;
  /** Fallback icon (SVG element) when no photo exists. */
  icon?: React.ReactNode;
  /** Audience chip text, e.g. "Kantor · Sekolah". */
  chip?: string;
  /** Price string, e.g. "Rp 2.500" — rendered as "Mulai Rp 2.500/pcs". */
  price?: string;
  accent?: 'orange' | 'green' | 'purple' | 'blue';
  /** Sticker outline + accent emphasis (use for the best seller). */
  featured?: boolean;
  style?: React.CSSProperties;
}
export declare function ProductCard(props: ProductCardProps): JSX.Element;
