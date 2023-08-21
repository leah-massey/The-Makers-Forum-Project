import myLocation, { message, name, getGreeting } from "./myModule";
import add, { subtract } from "./math";

//testing myModule.js imports
console.log(message);
console.log(name);
console.log(myLocation);
console.log(getGreeting("jessica"));
// testing math.js imports
console.log(add(3, 5));
console.log(subtract(5, 9));
