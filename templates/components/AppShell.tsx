import { AppShell as MantineAppShell, type AppShellProps as MantineAppShellProps } from '@mantine/core';
import { baseContainerStates } from '../base/BaseContainer';
import { useKevlarContainer, deepMerge } from '@unlikefraction/kevlar/runtime';
import { isSmallMobile, isMobile } from '@unlikefraction/kevlar/primitives';
import type { DeepPartial } from '@unlikefraction/kevlar/types';

// AppShell: inherits BaseContainer.
// Platform: small_mobile/mobile → navbar/aside collapsed.
// Toggle button inherits Burger (use the Burger component template separately).

const states = { ...baseContainerStates };

// Platform-adaptive defaults
const platformDefaults = {
  small_mobile: { navbar: { collapsed: true }, aside: { collapsed: true } },
  mobile:       { navbar: { collapsed: true }, aside: { collapsed: true } },
  tablet:       { navbar: { collapsed: false }, aside: { collapsed: true } },
  desktop:      { navbar: { collapsed: false }, aside: { collapsed: false } },
};


// ─── PROPS ─────────────────────────────────────────────────────

export type KevlarAppShellProps = MantineAppShellProps & {
  states?:           DeepPartial<typeof states>;
  platformDefaults?: DeepPartial<typeof platformDefaults>;
};


// ─── THE COMPONENT ─────────────────────────────────────────────

export function AppShell(props: KevlarAppShellProps) {
  const {
    states: so, platformDefaults: pdo,
    children, ...mantineProps
  } = props;

  const spec = deepMerge({ states }, { states: so });
  useKevlarContainer(spec);

  const pd = deepMerge({ ...platformDefaults }, pdo ?? {});

  // Determine collapsed state based on current platform
  const navbarCollapsed = isSmallMobile() || isMobile()
    ? pd.small_mobile.navbar.collapsed
    : false;
  const asideCollapsed = isSmallMobile() || isMobile()
    ? pd.small_mobile.aside.collapsed
    : false;

  return (
    <MantineAppShell
      {...mantineProps}
      navbar={{ ...mantineProps.navbar, breakpoint: mantineProps.navbar?.breakpoint ?? 'sm', collapsed: { mobile: navbarCollapsed } } as any}
      aside={{ ...mantineProps.aside, breakpoint: mantineProps.aside?.breakpoint ?? 'sm', collapsed: { mobile: asideCollapsed } } as any}
    >
      {children}
    </MantineAppShell>
  );
}
