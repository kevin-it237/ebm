import index from "./index";

export const setToken = (token)=>{
    return window.localStorage.setItem('token', token);
}

export const getToken = ()=>{
    return window.localStorage.getItem('token');
}

export const verifiedEmail = (email)=>{
    if (email === null || typeof email != 'string') return 'Invalid Email'

    // Regex to validate the email address
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    // If the test return false, we assign the string 'Email is not valid', else and empty string ''
    const validation = regex.test(String(email).toLowerCase()) ? true : false;

    return validation
}

export const verifiedPassword = (password)=>{
    if (password.length < 6){
        return false
    }else {
        return true
    }
}

export const confirmationPass = (password, confirm)=>{
    if (password !== confirm){
        return false
    }else {
        return true
    }
}

export const verifiedPhone = (phone) =>{
    if (phone.length < 9){
        return 'Doit contenir au moins 9 chiffres'
    }
    phone = parseInt(phone);
    if (typeof phone === "number"){
        return ""
    }else {
        return "Doit etre un numero"
    }

}

export const rate = (tab) =>{
    if (tab.length !== 0){
        let som = 0;
        tab.map(index=>(
            som += index.rating
        ))
        const x = som/tab.length;
        return x.toFixed(1);
    }else{
        return 0;
    }
}