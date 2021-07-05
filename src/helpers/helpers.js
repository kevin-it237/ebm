/**
 * @description Check if the email address correspond to the regex
 * @param { string } email attribute 
 */
export const validateEmail = (email) => {
    if (email === null || typeof email != 'string') return 'Invalid Email'

    // Regex to validate the email address
    const regex = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    
    // If the test return false, we assign the string 'Email is not valid', else and empty string ''
    const validation = regex.test(String(email).toLowerCase()) ? '' : 'Email is not valid!';

    return validation
}

/**
 * @description convert base64 image to blob
 * @param {String} dataURI 
 */
export const dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}