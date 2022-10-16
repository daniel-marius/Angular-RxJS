import { Observable, interval, timer, fromEvent, of, from } from "rxjs";
import {
  map,
  pluck,
  filter,
  reduce,
  take,
  scan,
  tap,
  mergeMap,
  switchMap,
  concatMap,
  exhaustMap,
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

// const observable = new Observable((subscriber) => {
//   // subscriber.next("RxJS");
//   // subscriber.error("Error!");
//   // subscriber.next("RxJS2");
//   //
//   // subscriber.complete();
//   // subscriber.next("next");
//   const id = setInterval(() => {
//     subscriber.next("test");
//   }, 1000);
//
//   subscriber.complete();
//
//   return () => {
//     clearInterval(id);
//   };
// });

// const observable = interval(1000);
// const observable = timer(0, 100);
// const observable = fromEvent(
//   document, 'click'
// );

// const observable = from([1, 2, 3, 4, 5]);
// const numsWithSymbols = observable.pipe(map((value) => `$${value}`));

// const observable = fromEvent(document, "keydown").pipe(
//   // pluck("code"),
//   // filter((code) => code === "Space")
//   map((event) => (event.code === "Space" ? event.code : null))
// );

// const observable = interval(500).pipe(
//   take(5),
//   tap({
//     next(val) {
//       console.log(val);
//     },
//   }),
//   reduce((acc, curr) => acc + curr, 0)
// );

const button = document.querySelector("#btn");
// const observable = fromEvent(button, "click").pipe(
//   mergeMap(() => ajax.getJSON("https://jsonplaceholder.typicode.com/todos/1"))
// );

// const observable = fromEvent(button, "click").pipe(
//   mergeMap(() =>
//     interval(1000).pipe(
//       tap({
//         next(val) {
//           console.log(val);
//         },
//       })
//     )
//   ),
//   take(5)
// );

// const observable = fromEvent(button, "click").pipe(
//   switchMap(() =>
//     ajax.getJSON("https://jsonplaceholder.typicode.com/todos/1").pipe(
//       take(5),
//       tap({
//         complete() {
//           console.log("inner observable completed!");
//         },
//       })
//     )
//   )
// );

// const observable = fromEvent(button, "click").pipe(
//   concatMap(() =>
//     ajax.getJSON("https://jsonplaceholder.typicode.com/todos/1").pipe(
//       take(5),
//       tap({
//         complete() {
//           console.log("inner observable completed!");
//         },
//       })
//     )
//   )
// );

const observable = fromEvent(button, "click").pipe(
  exhaustMap(() =>
    ajax.getJSON("https://jsonplaceholder.typicode.com/todos/1").pipe(
      take(5),
      tap({
        complete() {
          console.log("inner observable completed!");
        },
      })
    )
  )
);

const subscription = observable.subscribe({
  next: (value) => {
    console.log(value);
  },
  complete: () => {
    console.log("complete called!");
  },
  error: (error) => {
    console.error(error);
  },
});

// setTimeout(() => {
//   subscription.unsubscribe();
// }, 4000);
