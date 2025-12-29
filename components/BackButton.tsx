"use client"

import { useRouter } from 'next/navigation';

import { ChevronLeftIcon } from 'lucide-react';

import { useRefererUrl } from '@/components/RefererContext';
import { Button } from '@/components/ui/button';


interface BackButtonProps extends React.ComponentProps<typeof Button> {
  refererPath: `/${string}`
}
export function BackButton({
  refererPath,
  size = "icon",
  variant = "secondary",
  children = <ChevronLeftIcon />,
  ...props
}: BackButtonProps) {
  const { push, back } = useRouter()
  const { refererUrl } = useRefererUrl()

  const handleClick = () => {
    //* check if referer is equal to the passed refererPath
    if (refererUrl && refererUrl.pathname === refererPath) {
      //* if so, safe to go back in browser history entries
      back()
    } else {
      //* else navigate to that url as fallback
      push(refererPath)
    }
  }

  return (
    <Button
      onClick={handleClick}
      size={size}
      variant={variant}
      children={children}
      {...props}
    />
  );
};
