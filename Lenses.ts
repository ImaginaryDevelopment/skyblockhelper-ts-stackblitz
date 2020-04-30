console.log('lensing!');
export interface ILens<T, V> {
  get(t: T): V;
  set(a: T, value: V): T;
}

export let createLens = <TState>() => ({
  prop: <TProp extends keyof TState>(name:TProp) : ILens<TState,TState[TProp]> => ({
    get: (t:TState):TState[TProp] => t[name],
    set: (t:TState,value:TState[TProp]) : TState => (Object.assign({},t,{[name]:value}))
  })
});

// export let composeLenses = <TParent,TProp extends keyof TParent,TSubProp extends keyof TParent[TProp]>(lens1:ILens<TParent,TParent[TProp]>, lens2:ILens<TParent[TProp],TParent[TProp][TSubProp]>) : ILens<TParent, TParent[TProp][TSubProp]> => ({
//   get: (parent:TParent): TParent[TProp][TSubProp] => lens2.get(lens1.get(parent)),
//   set: (parent:TParent,value:TParent[TProp][TSubProp]): TParent => (lens1.set(parent,lens2.set(lens1.get(parent),value)))
// });

export let composeLenses = <TParent,TProp extends keyof TParent,TSubProp>(lens1:ILens<TParent,TParent[TProp]>, lens2:ILens<TParent[TProp],TSubProp>) : ILens<TParent, TSubProp> => ({
  get: (parent:TParent): TSubProp => lens2.get(lens1.get(parent)),
  set: (parent:TParent,value:TSubProp): TParent => (lens1.set(parent,lens2.set(lens1.get(parent),value)))
});
