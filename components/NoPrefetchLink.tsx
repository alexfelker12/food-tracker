import Link from 'next/link'

export default function NoPrefetchLink({
  prefetch,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link
      prefetch={prefetch ?? false}
      {...props}
    />
  );
}
