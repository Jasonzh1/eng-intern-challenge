const argv = process.argv;

result = "";
braille = true;

// Checking conversion direction
if (argv[2].length % 6 != 0) {
    braille = false;
} else {
    for (let i = 0; i < argv[2].length; i++) {
        if (argv[2].charAt(i) != "." && argv[2].charAt(i) != "O") {
            braille = false;
            break;
        }
    }
}

// Implementing bi-directional map
class TwoWayMap {
    constructor(map) {
       this.map = map;
       this.reverseMap = {};
       for(const key in map) {
          const value = map[key];
          this.reverseMap[value] = key;   
       }
    }
    get(key) { return this.map[key]; }
    revGet(key) { return this.reverseMap[key]; }
}

// Creating translation map
const twoWayMap = new TwoWayMap({
    "O....." : "a", 
    "O.O..." : "b", 
    "OO...." : "c", 
    "OO.O.." : "d", 
    "O..O.." : "e", 
    "OOO..." : "f", 
    "OOOO.." : "g", 
    "O.OO.." : "h", 
    ".OO..." : "i", 
    ".OOO.." : "j",
    "O...O." : "k",
    "O.O.O." : "l",
    "OO..O." : "m",
    "OO.OO." : "n",
    "OOO.O." : "p",
    "OOOOO." : "q",
    "O.OOO." : "r",
    ".OO.O." : "s",
    ".OOOO." : "t",
    "O...OO" : "u",
    "O.O.OO" : "v",
    ".OOO.O" : "w",
    "OO..OO" : "x",
    "OO.OOO" : "y",
    "O..OOO" : "z",
    ".....O" : "capital",
    ".O...O" : "decimal",
    ".O.OOO" : "number",
    "..OO.O" : ".",
    "..O..." : ",",
    "..O.OO" : "?",
    "..OOO." : "!",
    "..OO.." : ":",
    "..O.O." : ";",
    "....OO" : "-",
    ".O..O." : "/",
    ".OO..O" : "<",
    "O..OO." : ">",
    "O.O..O" : "(",
    ".O.OO." : ")",
    "......" : " ",
    "O..OO." : "o",
});

// Letter to number conversion
const numberMap = new TwoWayMap({
    "a" : "1",
    "b" : "2",
    "c" : "3",
    "d" : "4",
    "e" : "5",
    "f" : "6",
    "g" : "7",
    "h" : "8",
    "i" : "9",
    "j" : "0"
});

capital = false;
number = false;

// Conversion implementation
for (let i = 2; i < argv.length; i++) {
    // Braille -> English
    if (braille) {
        for (let j = 0; j < argv[i].length; j += 6) {

            let temp = twoWayMap.get(argv[i].substring(j, j+6));

            // Capital Case
            if (capital) {
                result += temp.toUpperCase();
                capital = false;

            // Number Case
            } else if (number) {
                if (temp == " ") {
                    result += temp;
                    number = false;
                } else {
                    result += numberMap[temp];
                }

            // Regular Conversion
            } else {
                if (temp == "capital") {
                    capital = true;
                } else if (temp == "number") {
                    number = true;
                } else if (temp == "decimal") {
                    result += temp;
                    result += ".";
                } else {
                    result += temp;
                }
            }
        }

    // English -> Braille
    } else {
        number = false;
        for (let j = 0; j < argv[i].length; j++) {
            let temp = twoWayMap.revGet(argv[i].charAt(j));

            // Capital Case
            if (temp == undefined && twoWayMap.revGet(argv[i].charAt(j).toLowerCase()) != undefined) {
                result += twoWayMap.revGet("capital");
                result += twoWayMap.revGet(argv[i].charAt(j).toLowerCase());

            }

            // Number Case
            else if (number || (temp == undefined && numberMap.revGet(argv[i].charAt(j)) != undefined)) {
                if (!number) {
                    result += twoWayMap.revGet("number");
                    number = true;
                } 
                result += twoWayMap.revGet(numberMap.revGet(argv[i].charAt(j)));
            }

            // Regular Conversion
            else {
                result += temp;
            }
        }
        if (i != argv.length - 1) { 
            result += "......";
        }
    }
}


console.log(result);