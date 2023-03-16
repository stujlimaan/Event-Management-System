
const isValidBody = (value)=>{
    return Object.keys(value).length>0
}

const isValidInputValue = (value)=>{
    if( typeof (value) == "undefined" || value == null) return false
    if( typeof(value) == "string" && value.trim().length >0) return true
    return false
}

const isValidOnlyCharacter =(value)=>{
    return /^[A-Za-z]+$/.test(value)
}

const isValidEmail = (email)=>{
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexForEmail.test(email);
}

const isValidPhone = (phone)=>{
    const regexForMobile = /^[6-9]\d{9}$/;
    return regexForMobile.test(phone);
}

const isValidPassword = (password)=>{
    const regexForPass = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
    return regexForPass.test(password);
}

const isValidNumber = function (value) {
    if (typeof (value) === "undefined" || value === null) return false;
    if (typeof (value) === "string" && value.trim().length > 0 && Number(value) !== NaN) return true
    if (typeof (value) === "number") return true;
    return false;
};

module.exports ={isValidBody,isValidEmail,isValidInputValue,isValidOnlyCharacter,isValidPassword,isValidPhone,isValidNumber}