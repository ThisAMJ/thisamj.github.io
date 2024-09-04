
alphabets = {
    alphalower: "abcdefghijklmnopqrstuvwxyz",
    alphaupper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    numeric: "1234567890",
    asciisymbols: "`~!@#$%^&*()-_=+[{]}\\|;:'\",<.>/?"
};

alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()`~-_=+[{]}\\|;:'\",<.>/?";
pass = '';
for (let i = 0; i < 32; i++) {
    // crypto.getRandomValues? crypto.subtle.generateKey?
    pass += alphabet[parseInt(Math.random() * alphabet.length)];
}
console.log(pass);
