"use client"

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';


interface BackButtonProps extends React.ComponentProps<typeof Button> {
  referrerPath: `/${string}`
}
export function BackButton({ referrerPath, ...props }: BackButtonProps) {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push(referrerPath)}
      {...props}
    />
  );
};
