const text = "C:/Users/Visitor>"; 
const textSpeed = 200;
const textDelay = 6000;
let index = 0;
const visitorText = document.getElementById("visitor-text");

function mengetik() {
    if (index<text.length) {
        visitorText.innerHTML += text.charAt(index);
        index++;
        setTimeout(mengetik, textSpeed);
    } else {
        setTimeout(() => {
            visitorText.innerHTML = "";
            index = 0;
            mengetik();
        }, textDelay);
    }
}
mengetik();