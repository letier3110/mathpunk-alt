
/**
 * source 
 * https://stackoverflow.com/questions/13077923/how-can-i-convert-a-string-into-a-math-operator-in-javascript
 */

// var math_it_up = {
//     '+': function (x, y) { return x + y },
//     '-': function (x, y) { return x - y }
// }​​​​​​​;
// math_it_up['+'](1, 2) == 3;

export enum MathOperations {
    PLUS = '+',
    MINUS = '-'
}

// class MathModule {
//     private string
//     constructor() {

//     }


// }

// export const mathModule = new MathModule();

export const math_it_up = {
    [MathOperations.PLUS]: function (x: number, y: number) { return x + y },
    [MathOperations.MINUS]: function (x: number, y: number) { return x - y }
}
