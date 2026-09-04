import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

function Page({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('relative flex min-h-dvh w-full flex-col bg-white', className)}>
      {children}
    </div>
  );
}

function Header({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('sticky top-0 z-10 w-full bg-white px-4 py-3', className)}>
      {children}
    </header>
  );
}

function Main({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={cn('flex w-full flex-1 flex-col items-center px-4 py-4', className)}>
      {children}
    </main>
  );
}

function Footer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <footer className={cn('w-full border-t border-gray-100 bg-white px-4 py-2', className)}>
      {children}
    </footer>
  );
}

Page.Header = Header;
Page.Main = Main;
Page.Footer = Footer;

export { Page };
