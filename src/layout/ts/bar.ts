
interface CollapseKey {
    update:()=>void
}

export const isCollapseKey = Symbol() as InjectionKey<CollapseKey>