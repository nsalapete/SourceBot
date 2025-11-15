import { NavLink as RouterNavLink, NavLinkProps } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const NavLink = ({ className, ...props }: NavLinkProps) => {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        cn(
          'transition-colors hover:text-foreground/80',
          isActive ? 'text-foreground' : 'text-foreground/60',
          className
        )
      }
      {...props}
    />
  );
};
