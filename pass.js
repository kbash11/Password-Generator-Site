const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");

const lengthDisplay=document.querySelector("[data-lengthNumber]");
const inputSlider=document.querySelector("[data-lengthSlider]");
const allcheckBox=document.querySelectorAll("input[type=checkbox]");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");

const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//intial values
let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();

//set pass length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}
//for numbers
function generateRandomNumber(){
    return getRndInteger(0,9);
}
// for uppercase letters
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
//for lowercase letters
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
//for symbols
function generateSymbol(){
    const randNum=getRndInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked){
        hasUpper=true;
    }
    if(lowercaseCheck.checked){
        hasLower=true;
    }
    if(numbersCheck.checked){
        hasNum=true;
    }
    if(symbolsCheck.checked){
        hasSym=true;
    }
    if(hasUpper && hasLower && hasNum && hasSym && passwordLength>=10){
        setIndicator("dark green");
    }else if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("light green");
    }else if((hasLower || hasUpper) && (hasLower || hasNum) && (hasLower || hasSym) && (hasUpper || hasNum) && (hasUpper || hasSym) && (hasNum || hasSym) && passwordLength>=6){
        setIndicator("#ff0");
    }else{
        setIndicator("red");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    } 
    copyMsg.classList.add("active");
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange(){
    checkCount=0;
    allcheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function shufflePasssword(array){
    //fisher yates algorithm
    for (let i = array.length - 1; i > 0; i--) {
        //to find random j
        const j = Math.floor(Math.random() * (i + 1));
        // swapping btw i and j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

generateBtn.addEventListener('click',()=>{
    
    if(checkCount==0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    password="";
    //new pass
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsory addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIndex=getRndInteger(0,funcArr.length);
        password+=funcArr[randIndex]();
    }

    password=shufflePasssword(Array.from(password));

    passwordDisplay.value=password;

    calStrength();
});



