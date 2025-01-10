function unique(arr) {
    return [...new Set(arr)].join('');
}

alphabets = {
    alphalower: "abcdefghijklmnopqrstuvwxyz",
    alphaupper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    alpha: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numeric: "1234567890",
    alphanumeric: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890",
    asciisymbols: "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?"
};
alphabets.all = unique(Object.keys(alphabets).map(key => alphabets[key]).join(''));

function generate(length, alphabet) {
    let pass = '';
    for (let i = 0; i < length; i++) {
        // naive version:
        // pass += alphabet[parseInt(Math.random() * alphabet.length)];
        // cryptographically secure rng:
        pass += alphabet[parseInt(crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF * alphabet.length)];
    }
    return pass;
}

console.log(generate(32, alphabets.all));
