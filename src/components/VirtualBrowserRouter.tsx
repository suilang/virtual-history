import React, { createContext, useContext, useMemo } from 'react';
interface IContextConfig {
    path: string;
    basename: string;
}
const Context = createContext<IContextConfig>({ path: '/', basename: '' });

/**
 * Replace the BrowserRouter
 * - path: the path of the current page, need start with /
 * - basename: the basename of the current page, need start with / but can not only be /, if not set, will be empty string
 */
export function VirtualBrowserRouter({
    path,
    children,
    basename = '',
}: {
    path: string;
    children: any;
    basename?: string;
}) {
    const value = useMemo(() => {
        let realPath = path;
        if (!realPath.startsWith('/')) {
            realPath = '/' + realPath;
        }
        if (realPath.endsWith('/')) {
            realPath = realPath.slice(-1);
        }
        if(!realPath){
            realPath = '/'
        }
        let realBase = basename;
        if (!realBase.startsWith('/')) {
            realBase = '/' + realBase;
        }
        if (realBase.endsWith('/')) {
            realBase = realBase.slice(-1);
        }

        return {
            path: realPath,
            basename,
        };
    }, [path]);
    return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function VirtualRoute({ path, children }: { path?: string; children: any }): JSX.Element {
    const { path: currentPath, basename } = useContext(Context);
    if (!path || currentPath === (basename + path)) {
        return children;
    }
    return null;
}

export function VirtualSwitch({ children }: { children: any }) {
    const { path: currentPath, basename } = useContext(Context);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (currentPath === (basename + child.props.path)) {
            return child;
        }
    }

    return children[children.lengh - 1] || null;
}
