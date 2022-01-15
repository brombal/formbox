import getComparison from './getComparison';
import clone from './clone';

/**
 # SubscriptionBox

 A SubscriptionBox is an object that holds arbitrary data, allowing you set/get properties and subscribe to changes.
 The change algorithm does deep-comparisons, so you'll only be notified if properties actually change value
 (not simply whenever `set` is called).

 ```js
 const box = new SubscriptionBox({
   firstName: 'Johnny',
   favoriteBook: {
     title: 'Green Eggs and Ham',
     author: 'Dr. Seuss'
   }
 });

 const unsubscribe = box.subscribe(
   data => data.favoriteBook,
   (favoriteBook) => {
     ...
   }
 );
 ...
 unsubscribe();

 box.set(data => {
   // `data` is a mutable clone - change its value; don't return it
   data.favoriteBook.title = 'Horton Hears a Who'
 });

 // `box.data` is a read-only getter
 box.data.favoriteBook;
 ```
 */

export type SelectorFn<TIn, TOut extends any> = (input: TIn) => TOut;

export interface Subscription<TIn, TOut> {
  selector: (data: TIn) => TOut;
  callback: (_: TOut) => void;
  unsubscribe: () => void;
}

export default class SubscriptionBox<TData extends object> {
  private _data: TData;
  private subscriptions = new Set<Subscription<TData, any>>();

  constructor(data: TData) {
    this._data = data;
  }

  get data() {
    return this._data;
  }

  set = (data: TData | ((data: TData) => void)) => {
    let newData = data;
    if (typeof data === 'function') {
      newData = clone(this.data);
      (data as any)(newData);
    }
    const oldData = this.data;
    this._data = getComparison(this.data, newData);
    this.subscriptions.forEach((sub) => {
      const oldValue = sub.selector(oldData);
      const newValue = sub.selector(this.data);
      if (oldValue !== newValue) sub.callback(newValue);
    });
  };

  subscribe = <TOut>(
    selector: SelectorFn<TData, TOut>,
    callback: (val: TOut) => void,
  ): (() => void) => {
    const sub = { selector, callback } as Subscription<TData, TOut>;
    this.subscriptions.add(sub);
    sub.unsubscribe = () => this.subscriptions.delete(sub);
    return sub.unsubscribe;
  };

  unsubscribeAll = () => {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  };
}
