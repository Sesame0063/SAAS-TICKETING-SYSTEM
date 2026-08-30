interface Props {
  className?: string;
}

export default function Skeleton({ className = "" }: Props) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-700/40 ${className}`}
    />
  );
}




