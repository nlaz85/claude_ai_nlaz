interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'content-type';
}

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  const className = variant === 'content-type'
    ? `badge badge--type-${status}`
    : `badge badge--${status}`;

  const label = status.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return <span className={className}>{label}</span>;
}
