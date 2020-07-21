/***
 * Salt is meant to be concatunated behind
 * an users data that you want to encryot to add
 * an extra layer of security.
 * ex(password + salt)
 * we rocomend you feed the result to a encryption api
 * and produce a hash value. 
 */
const salt = (range = {beg: 0, end: 26}, keyLength = 10) => {
    let counter = 0;
    let keyRing = [];
    while(counter < keyLength) {
        const random = range.beg === 0 ? 
            Math.floor(Math.random() * range.end) :
            Math.floor((Math.random() * range.beg) * range.end); 
        keyRing.push(characterNumber(random));
        counter++;
    }
    const encrypted = encrypt(keyRing);
    let stringSalt = keyRing.toString();
    while(stringSalt.indexOf(',') !== -1) {
        stringSalt = stringSalt.replace(',','');
    }
    return {
        salt: stringSalt,
        encrypted: encrypted.keyRing,
        sequence: encrypted.sequence, 
    };
}
// decides wheather to return a number or a character
const characterNumber = number => {
    if(Math.floor(Math.random() * 2))
        return String.fromCharCode(97 + number)
    return number;
     
}
// meant to encrypt the salt value saved in the database.
const encrypt = (keyRing) => {
    let newKeyRing = [];
    let sequence = [];
    for(let key of keyRing) {
        let value;
        if (isNaN(key)) {
            value = key.charCodeAt(0);
            sequence.push('c');
        }
        else {
            value = key;
            sequence.push('n');
        }
        value = parseInt(value);
        newKeyRing.push(equation(value, 'encrypt'));
    }
   // console.log(newKeyRing);
    return {
        keyRing: newKeyRing,
        sequence: sequence
    }
}
// meant to decrypt the salt value saved in the database.
const decrypt = (keyRing, sequence) => {
    let newKeyRing;
    for(let x = 0; x < keyRing.length; x++) {
        let value;
        let key = keyRing[x];
        if (sequence[x] === 'c') {
            value = equation(key, 'decrypt');
            value = String.fromCharCode(value);
        }
        else {
            value = key;
            value = equation(value, 'decrypt');
            value = value.toString();
        }
        newKeyRing = newKeyRing === undefined ? value : newKeyRing + value;
    }
    return newKeyRing;
}
const equation = (value, direction) => {
    if(direction === 'encrypt') {
        return ((value + 20) - 5) * 2; 
    } else {
        return ((value / 2) + 5) - 20;
    }
}

module.exports = {
    salt,
    decrypt
}