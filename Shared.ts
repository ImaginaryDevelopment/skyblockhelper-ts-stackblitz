/* @strict */
import * as Types from './Types'

declare global {
    interface Array<T> {
        flat(this: T[] | T[][],depth?:number): Array<T>;
        includes(this:T[],x:T): boolean;
    }
}

// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
export let addDays = (x:Date,days:number):Date => {
    var date = new Date(x.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
export let addHours = (x:Date,h:number):Date => {
  var date = new Date(x.valueOf());
  date.setTime(x.getTime() + (h*60*60*1000));
  return date;
}

export let addMinutes = (date:Date, minutes:number):Date =>
    new Date(date.getTime() + minutes*60000);


export let pascal = (x:string) : string => x.charAt(0).toUpperCase() + x.slice(1);

// https://blog.abelotech.com/posts/number-currency-formatting-javascript/
export let formatNumber = (num:number,places=2) : string =>
  num == null ? 'null'
  : num == NaN ? 'NaN'
  : (+num).toFixed(+places).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

export let copyUpdate = <TState,TProp extends keyof TState>(old:TState,name:TProp,value:TState[TProp]) : TState =>{
  // let dummy = old[name] = value;
  let next = Object.assign({},old,{[name]:value}) as TState;
  console.log('copyUpdate',old,next);
  return next;
}

export let copyUpdates = <State,K extends keyof State>(state:Pick<State,K>) => {}
type TStringOpt<T extends string> = (T | '' | undefined)

export let id = <T>(x:T) => x;

export let mapValueString = <T extends string,TOut>(f:Types.Func1<T,TOut>) => (x:TStringOpt<T>): TOut | undefined => {
  if(x == '' || x == null) return null;
  return f(x);
}

export let getAttrValue = (x:HTMLElement,name:string) =>
  x.attributes != null && (x.attributes as any)[name] && (x.attributes as any)[name].value;
let addClasses = (x:string,y:string) =>
  (x != null && y != null) ?  x + ' ' + y : (x || y);

let getName = <T extends string>(ev:{target:{name:TStringOpt<T>, attributes:Attr[]}}) : TStringOpt<T> =>
    ev.target && (getAttrValue(ev.target as any as HTMLElement,'data-name') || ev.target.name);

type TargetedEvent = (undefined | {target?:{name:string}} | {target?: {attributes:Attr[]}});

//type NameValueTarget
// is there a name for Action or Func that isn't the generic delegate and implies if Func the result is returned?
type PureDelegate<TIn,TOut> = Types.Func1<TIn,TOut> | Types.Action1<TIn>;

export let getTargetInfo = <T,>(title:string,f:PureDelegate<Types.NameValue,T>) => (ev:{target:undefined|{name:string, value:string,attributes:Attr[]}}) => {
  if(ev == null || ev!.target == null || ev!.target.value == null){
    console.error('getTargetInfo', title, ev && ev.target);
    console.error('getTargetInfo', ev);
  }
  let name = ev.target && (getAttrValue(ev.target as any as HTMLElement,'data-name') || ev.target.name);
  let nv : Types.NameValue = {name, value: ev.target && (ev.target as any).value};
  console.log('getTargetInfo',nv,ev.target);
  return f(nv);
};

export let getTargetName = <T extends string,TOut>(title:string,f:PureDelegate<TStringOpt<T>,TOut>) => (ev:{target:{name:TStringOpt<T>, attributes:Attr[]}}) =>
{
    try{
      let name : TStringOpt<T> = getName<T>(ev);
      let result = f(name);
      return result;
    } catch(e){
      console.error(title+'.getTargetName');
    }
}
// should we also consider here data-value?
export let getTargetValue = <T extends string,TOut>(title:string,f:PureDelegate<T,TOut>) => (ev:undefined | {target:undefined | {value:any}}) => {
  try{
    let value:T = ev && ev.target && ev.target.value as T;
    return f(value);
  }
  catch(e){
    console.error(title+'.getTargetValue',e);
  }
};

export let toggleArrayValue = <T,>(source:T[],target:T) : T[] =>{
  let included = [target, ...source];
  console.log('toggleArrayValue', source,target,included);

  return source.includes(target) ? source.filter(x => x != target) : included;
};

export let distinct = <T>(items:T[], by?:Types.Func1<T,any>) : any[]  => {
  try{
    let itemsMapped = by != null ? items.map(by) : items;
    let s = new Set(itemsMapped);
    let result:any[] = [];
    s.forEach(x => result.push(x));
    return result;
  } catch (e){
    console.error('distinct',e);
    return [];
  }
};

export let sort = <T>(items:T[], by?:Types.Func2<T,T,number>) : T[] => {
  if (items == null) console.error('sort bad in');
  let sorted = [...items].sort( by != null ? by: undefined);
  if(sorted == null) console.error('sort was bad', items,sorted);
  if(items.length != sorted.length) console.error('sort length was bad', items,sorted);
  return sorted;
}

export let isValueString = (x:string | undefined | null) => x != null && x != '' && x.trim() != '';

let loggedStorageFailure = false

export type StorageAccess<T> = {
  getIsLocalStorageAvailable: (source:any) => boolean
  // we aren't accounting for clearing a value, would just passing undefined do it?
  storeIt: (value:T) => void
  readIt: <TOut>(defaultValue:TOut) => (T | TOut)
  makeBaby: <TChild extends keyof T>(key:string) => StorageAccess<T[TChild]>
  getKeys: any // Iterable<string> // Generator<string,void,void> ? neither compiles
}
let getIsLocalStorageAvailable = (source:any) =>{
    if (typeof(localStorage) !== 'undefined' && (typeof(localStorage.setItem) === 'function') && typeof(localStorage.getItem) === 'function'){
      return true;
    }
    try {
      var storage = source['localStorage'],
        x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      console.info('storage is available!');
      return true;
    }
    catch(e) {
      if(!loggedStorageFailure){
        loggedStorageFailure = true;
        console.info('failed to test storage available');
      }
      return false;
    }
}
export let createStorageAccess = (source:any) => <T>(key:string) : StorageAccess<T> => ({
  makeBaby: <TChild extends keyof T>(subkey:string):StorageAccess<T[TChild]> => createStorageAccess(source)(key+'.'+subkey),
  getIsLocalStorageAvailable : () => getIsLocalStorageAvailable(source),

  storeIt: (value: T | undefined ) =>{
    var canStore = getIsLocalStorageAvailable(source);
    if(canStore){
      var stringy = JSON.stringify(value);
      //console.info('storing:' + key,value);
      localStorage.setItem(key,stringy);
    }
  },

  readIt: function<TOut>(defaultValue:TOut) : (T | TOut) {
    if(getIsLocalStorageAvailable(source)){
      var item = localStorage.getItem(key);
      if(typeof(item) !== 'undefined' && item != null){
        // console.info("read item from localStorage", key,item);
        try{
          return JSON.parse(item);
        }
        catch (ex)
        {
          return defaultValue;
        }
      } else {
        return defaultValue;
      }
    } else {
      return defaultValue;
    }
  },
  getKeys: function* () {
    for (var i = 0; i < localStorage.length; i++) {
        yield localStorage.key(i);
    }
  }
});