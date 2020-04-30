export type Func<TOut> = () => TOut
export type Func1<TIn,TOut> = (x:TIn) => TOut
export type Func2<T1,T2,TOut> = (x:T1,y:T2) => TOut
export type Func3<T1,T2,T3,TOut> = (x:T1,y:T2,z:T3) => TOut
export type Action = () => void
export type Action1<T> = (x:T) => void
export type Action2<T1,T2> = (x:T1,y:T2) => void
export type ActionAny = ([...args]:any[]) => void

export type NameValue = {name:string,value:string};
export type EventHandler = (nv:NameValue) => void;


export type ComponentEventHandler<TComponentState> = (next:TComponentState) => void;

