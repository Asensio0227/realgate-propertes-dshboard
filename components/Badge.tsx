export function Badge({
  label,
  bg,
  color,
}: {
  label: string;
  bg: string;
  color: string;
}) {
  return (
    <span
      style={{
        background: bg,
        color,
        padding: '3px 10px',
        borderRadius: '100px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}
    >
      {label}
    </span>
  );
}
