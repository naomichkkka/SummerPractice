const lowercaseLetters = [
    'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'
];

const uppercaseLetters = [
    'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
];

function getCharIndex(array, char) {
    for (let i = 0; i < 26; i++) {
        if (array[i] === char) {
            return i;
        }
    }
    return -1;
}

// ROT13 дешифровка
function decodeROT13(text) {
    let decoded = "";
    let index = 0;

    while (index < text.length) {
        let symbol = text[index];
        let lowerIdx = getCharIndex(lowercaseLetters, symbol);

        if (lowerIdx !== -1) {
            let newIdx = (lowerIdx + 13) % 26;
            decoded += lowercaseLetters[newIdx];
        } else {
            let upperIdx = getCharIndex(uppercaseLetters, symbol);
            if (upperIdx !== -1) {
                let newIdx = (upperIdx + 13) % 26;
                decoded += uppercaseLetters[newIdx];
            } else {
                decoded += symbol;
            }
        }

        index++;
    }

    return decoded;
}

// функция запуска дешифрации
function handleDecode() {
    const input = document.getElementById("inputText").value;
    const output = decodeROT13(input);
    document.getElementById("outputText").value = output;
}