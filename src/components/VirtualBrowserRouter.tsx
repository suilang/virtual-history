import React, { createContext, useContext, useMemo } from 'react';
interface IContextConfig {
  path: string;
}
const Context = createContext<IContextConfig>({ path: '/' });

export function VirtualBrowserRouter({ path, children }: { path: string; children: any }) {
  const value = useMemo(() => {
    const realPath = path.startsWith('/') ? path : `/${path}`;
    return {
      path: realPath,
    };
  }, [path]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function VirtualRoute({ path, children }: { path?: string; children: any }): JSX.Element {
  const { path: currentPath } = useContext(Context);
  if (!path || currentPath === path) {
    return children;
  }
  return null;
}

export function VirtualSwitch({ children }: { children: any }) {
  const { path: currentPath } = useContext(Context);
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (currentPath === child.props.path) {
      return child;
    }
  }

  return children[children.lengh - 1] || null;
}
