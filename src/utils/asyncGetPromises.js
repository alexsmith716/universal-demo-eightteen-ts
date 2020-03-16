import { matchRoutes } from 'react-router-config';

function getPromises(match, store) {
  const arr = match.map(q => q.route.loadData).filter(r => r !== undefined);
  console.log('##################### asyncGetPromises > getPromises() > array: ', arr)
  return arr.map(a => a(store));
}

async function asyncGetPromises(routes, pathname, store) {
  const match = matchRoutes(routes, pathname);
  const promises = await getPromises(match, store);
  console.log('##################### asyncGetPromises > await getPromises(): ', promises);
  await Promise.all(promises);
}

export default asyncGetPromises;

// Promise.all takes an array of promises (or any iterable) and returns a promise that resolves 
//    when all of the promises in the iterable argument have resolved, 
//    or rejects with the reason of the first passed promise that rejects

// const p1 = Promise.resolve(3);
// const p2 = 42;

// const p3 = new Promise((resolve, reject) => {
//   setTimeout(resolve, 100, "foo"); 
// });

// Promise.all([p1, p2, p3]).then(values => { 
//   console.log(values); // [3, 42, "foo"]
// });
