'use client';

import { TabItem, Tabs } from '@worldcoin/mini-apps-ui-kit-react';
import { Home, InfoCircle } from 'iconoir-react';
import { usePathname, useRouter } from 'next/navigation';

const TABS = [
  { value: 'home', href: '/home', label: 'Play', icon: <Home /> },
  { value: 'about', href: '/about', label: 'About', icon: <InfoCircle /> },
] as const;

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const active = TABS.find((tab) => pathname.startsWith(tab.href))?.value ?? 'home';

  return (
    <Tabs
      value={active}
      onValueChange={(value) => {
        const tab = TABS.find((t) => t.value === value);
        if (tab) router.push(tab.href);
      }}
    >
      {TABS.map((tab) => (
        <TabItem key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
      ))}
    </Tabs>
  );
}
