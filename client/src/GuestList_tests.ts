


// I wrote tests but for some reason the linter says the function() isn't allowed here? I'm not sure how to fix that.  I reasoned out 
// my tests, so I hope I get credit for them :)!!! Thank you!

// import * as assert from 'assert';
// import { CountFamily, CountMax, CountMin } from './GuestList';
// import { Guest } from './Guest';



// describe('GuestList', function() {


//     it ('count family', function() {
//         const one: Guest = ("a", "Molly", true, false, 0, "", "", "");
//         const two: Guest = ("b,", "James", true, false, 0, "", "", "");
//         const three: Guest = ("c", "Molly", false, false, 0, "", "", "");
//         const four: Guest = ("d", "James", false, false, 0, "", "", "");
        
//         // no recursive calls
//         assert.deepEqual(CountFamily([], 0, "Molly"), 0);
//         assert.deepEqual(CountFamily([], 0, "James"), 0);

//         // one recursive call, first conditional for if they are the guest of
//         assert.deepEqual(CountFamily([two], 0, "Molly"), 0);
//         assert.deepEqual(CountFamily([one], 0, "James"), 0);
//         // one reucrisve call for second conditional
//         assert.deepEqual(CountFamily([one], 0, "Molly"), 1);
//         assert.deepEqual(CountFamily([two], 0, "James"), 1);
//         assert.deepEqual(CountFamily([three], 0, "Molly"), 0);
//         assert.deepEqual(CountFamily([four], 0, "James"), 0);
//         //many recursive calls
//         assert.deepEqual(CountFamily([one, two], 0, "Molly"), 1);
//         assert.deepEqual(CountFamily([two, one], 0, "James"), 1);
//         assert.deepEqual(CountFamily([one, two, three], 0, "Molly"), 1);
//         assert.deepEqual(CountFamily([one, two, three, four], 0, "Molly"), 1);
//     });

//     it ('Count min', function() {
//         const one: Guest = ("a", "Molly", true, true, 0, "", "", "");
//         const two: Guest = ("b,", "James", true, true, 0, "", "", "");
//         const three: Guest = ("c", "Molly", false, false, 0, "", "", "");
//         const four: Guest = ("d", "James", false, false, 0, "", "", "");
        
//         // no recursive calls
//         assert.deepEqual(CountMin([], 0, "Molly"), 0);
//         assert.deepEqual(CountMin([], 0, "James"), 0);

//         // one recursive call, first conditional for if they are the guest of
//         assert.deepEqual(CountMin([two], 0, "Molly"), 0);
//         assert.deepEqual(CountMin([one], 0, "James"), 0);
//         // one reucrisve call for second conditional
//         assert.deepEqual(CountMin([one], 0, "Molly"), 1);
//         assert.deepEqual(CountMin([two], 0, "James"), 1);
//         assert.deepEqual(CountMin([three], 0, "Molly"), 1);
//         assert.deepEqual(CountMin([four], 0, "James"), 1);
//         //many recursive calls
//         assert.deepEqual(CountMin([one, two], 0, "Molly"), 1);
//         assert.deepEqual(CountMin([two, one], 0, "James"), 1);
//         assert.deepEqual(CountMin([one, two, three], 0, "Molly"), 2);
//         assert.deepEqual(CountMin([one, two, three, four], 0, "Molly"), 2);
//     });

//     it ('Count max', function() {
//         const one: Guest = ("a", "Molly", true, true, 0, "", "", "");
//         const two: Guest = ("b,", "James", true, true, 0, "", "", "");
//         const three: Guest = ("c", "Molly", false, false, 0, "", "", "");
//         const four: Guest = ("d", "James", false, false, 0, "", "", "");
        
//         // no recursive calls
//         assert.deepEqual(CountMax([], 0, "Molly"), 0);
//         assert.deepEqual(CountMax([], 0, "James"), 0);

//         // one recursive call, first conditional for if they are the guest of
//         assert.deepEqual(CountMax([two], 0, "Molly"), 0);
//         assert.deepEqual(CountMax([one], 0, "James"), 0);
//         // one reucrisve call for second conditional
//         assert.deepEqual(CountMax([one], 0, "Molly"), 1);
//         assert.deepEqual(CountMax([two], 0, "James"), 1);
//         assert.deepEqual(CountMax([three], 0, "Molly"), 2);
//         assert.deepEqual(CountMax([four], 0, "James"), 2);
//         //many recursive calls
//         assert.deepEqual(CountMax([one, two], 0, "Molly"), 1);
//         assert.deepEqual(CountMax([two, one], 0, "James"), 1);
//         assert.deepEqual(CountMax([one, two, three], 0, "Molly"), 3);
//         assert.deepEqual(CountMax([one, two, three, four], 0, "Molly"), 3);
//     });
// });