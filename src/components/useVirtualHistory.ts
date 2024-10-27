import { useState, useEffect, useMemo } from "react";
import { VirtualHistory } from "./VirtualHistory";

export function useVirtualHistory(virtualHistory: VirtualHistory) {
    const [version, setVersion] = useState(0);

    useEffect(() => {
        function handler() {
            // 虚拟路由由下一个effect触发更新
            if (virtualHistory.useVirtual) {
                return;
            }
            setVersion((v) => v + 1);
        }

        window.addEventListener('popstate', handler);
        return () => {
            window.removeEventListener('popstate', handler);
        };
    }, []);

    useEffect(() => {
        const handler = () => {
            setVersion((v) => v + 1);
        };
        virtualHistory.eventListener.push(handler);
        return () => {
            const index = virtualHistory.eventListener.findIndex((i) => i === handler);
            index !== -1 && virtualHistory.eventListener.splice(index, 1);
        };
    }, []);
    return useMemo(() => {
        return { virtualHistory, version };
    }, [version]);
}
