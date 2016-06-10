// RxJS 5 In-depth (Best of Web 2016) by @gerardsans
//=====================================================
// 1) Create a basic Observable  - 
// 2) Add error handling         -
// 3) Create interval operator   - 
// 4) Make it cancellable        -
// 5) Create map operator        - 
// 6) Create filter operator     - 
// 7) Schedulers                 - 

let l = console.log;

// 1) Create a basic Observable

/* 
a$: ---1---2---3|
*/

let observer = {
  next: v => l(v),
  complete: () => console.log('|')
};

// let a$ = Rx.Observable.of(1, 2, 3);
let a$ = Rx.Observable.create(observer => {
	observer.next(1);
	observer.next(2);
	observer.next(3);
	observer.complete();
});

let subscription = a$.subscribe(observer);

.
.
.
.
.
.
.
.
.
.
.
.
.

// 2) Add error handling 

/* 
a$: ---1---X
*/

let observer = {
  next: v => l(v),
  error: e => l(e),
  complete: () => l('|')
};

let a$ = Rx.Observable.create(observer => {
	try {
		observer.next(1);
		throw('ups');
		observer.next(2);
		observer.next(3);
		observer.complete();
	}
	catch(e){
		observer.error(e);
	}
});

let subscription = a$.subscribe(observer);

.
.
.
.
.
.
.
.
.
.
.
.
.

// 3) Create interval Observable

/* 
a$: ---1---2---3---...
*/

let observer = {
  next: v => l(v),
  complete: () => l('|')
}; 

let a$ = Rx.Observable.create(observer => {
	let i = 1;
	setInterval(() => observer.next(i++), 2000);
});

let subscription = a$.subscribe(observer);

.
.
.
.
.
.
.
.
.
.
.
.
.

// 4) Make it cancellable

/* 
a$: ---1---2
*/

let observer = {
  next: v => l(v),
  complete: () => l('|')
};

let a$ = Rx.Observable.create(observer => {
	let i = 1;
	let token = setInterval(() => observer.next(i++), 2000);
	return () => clearInterval(token);
});

let subscription = a$.subscribe(observer);

setTimeout(() => subscription.unsubscribe(), 5000);

.
.
.
.
.
.
.
.
.
.
.
.
.

// 5) Create map operator

/* 
a$: ---1---2---3|
     map(x => x*2)
b$: ---2---4---6|
*/

let observer = {
  next: v => l(v),
  complete: () => l('|')
};

// let a$ = Rx.Observable.of(1, 2, 3);
let a$ = Rx.Observable.create(observer => {
	observer.next(1);
	observer.next(2);
	observer.next(3);
	observer.complete();
});

Rx.Observable.prototype.transform = transform;

function transform(fn){
	let input = this;
	return Rx.Observable.create(observer => {
		input.subscribe({ 
			next: v => observer.next(fn(v)),
			complete: () => observer.complete()
		});
	});
}

let b$ = a$.transform(x => x*2);

let subscription = b$.subscribe(observer);

.
.
.
.
.
.
.
.
.
.
.
.
.

// 5) Create filter operator

/* 
a$: ---1---2---3|
     filter(x => x%2===0)
b$: -------2----|
*/

let observer = {
  next: v => l(v),
  complete: () => l('|')
};

// let a$ = Rx.Observable.of(1, 2, 3);
let a$ = Rx.Observable.create(observer => {
	observer.next(1);
	observer.next(2);
	observer.next(3);
	observer.complete();
});

Rx.Observable.prototype.transform = transform;

function transform(fn){
	let input = this;
	return Rx.Observable.create(observer => {
		input.subscribe({
			next: v => fn(v) && observer.next(v),
			complete: () => observer.complete()
		});
	});
}

let b$ = a$.transform(x => x%2===0);

let subscription = b$.subscribe(observer);

.
.
.
.
.
.
.
.
.
.
.
.
.

// 7) Schedulers  

// ES6 Promises are asynchronous by default
let p = new Promise(resolve => resolve(10));
p.then(v => l(v));
l(20);

// let a$ = Rx.Observable.of(1);
let a$ = Rx.Observable.create(observer => {
	observer.next(1);
	observer.complete();
});
// Observables are synchronous by default
a$.subscribeOn(Rx.Scheduler.async)
  .subscribe({
  	next: v => l(v),
  	complete: () => l('|')
	});
l(2);

