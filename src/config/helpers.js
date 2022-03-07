import index from "./index";

export const setToken = (token)=>{
    window.token=token;
    window.localStorage.setItem('token', token);
    return true;
}

export const setUserData=(data)=>{
    window.localStorage.setItem('userData', JSON.stringify(data))
}

export const getUserDataFunction=()=>{
    return window.localStorage.getItem('userData')
}

export const setExist=()=>{
    window.localStorage.setItem('exist', true)
    return true;
}

export const setUser=(user)=>{
    window.user = user;
    window.localStorage.setItem('user', JSON.stringify(user))
}

export const getUser=()=>{
    return (window.localStorage.getItem('user'));
}

export const getExist=()=>{
    return window.localStorage.getItem('exist');
} 

export const getToken = ()=>{
    return (window.token?window.token:window.localStorage.getItem('token'));
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
    const regex = /^\+?\d{1,3} ?\d{3,} ?\d{3,} ?\d{3,}$/gm
    const regex6 = /^\00?\d{1,3} ?\d{3,} ?\d{3,} ?\d{3,}$/gm
    //const regex3 = /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/gm
    const regex1 = /^(\+?)([0-3] ?){9,20}$/gm
    const regex7 = /^(\00?)([0-3] ?){9,20}$/gm
    //const regex2 = /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{3}$/gm
    const regex2 = /^(\+\d{1,3}\s)?\(?\d{3,}\)?[\s.-]?\d{3,}[\s.-]?\d{3,}$/gm
    const regex5 = /^(\00\d{1,3}\s)?\(?\d{3,}\)?[\s.-]?\d{3,}[\s.-]?\d{3,}$/gm
    const regex3 = /^(\00\d{1,3}\s)?(\d{9,})$/gm
    const regex4 = /^(\+\s?\d{1,3})?(\d{9,})$/gm
    if (regex.test(phone) || regex1.test(phone) || regex2.test(phone) || regex3.test(phone) || regex4.test(phone) || regex5.test(phone) || regex6.test(phone) || regex7.test(phone)){
        return true
    }else {
        return false
    }
}

export const checkValue = (data)=>{
    if(data === ""){
        return true
    }else{
        return false
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
export const isMobile=()=>{
    return window.innerWidth<=965;
}
export const isMobileApp=()=>{
    return false;
}
