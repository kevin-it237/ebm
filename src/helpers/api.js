import axios from 'axios';

axios.interceptors.request.use(req => req, error => Promise.reject(error));

axios.interceptors.response.use(res => res, async (error) => { // refresh 
    var latestRequest = error.config;
    latestRequest._retry = true;

    // can't use number 401 yep kkakakaka (another shot)
    const messageHasTokenString = new RegExp(/(?:"message":")(.*token.* |.*Token.*)(")/g);
    const codeOrStatusHasTokenStatus = new RegExp(/(\"code\":401|\"status\":401)/g);
  
    return new Promise(async (resolve, reject) => { 
        if(codeOrStatusHasTokenStatus.test(JSON.stringify(error.response)) && messageHasTokenString.test(JSON.stringify(error.response))){
            localStorage.removeItem('token');
            // Logout the user here
        }else {
            reject(error);
        }
    })
})

const json = `application/json; charset=utf-8`;
const multPart = `multipart/form-data; charset=utf-8`;

const request = async (contentType, method, url, data, options = {}) => {
    const token = JSON.parse(localStorage.getItem('token'));
    const orgId = JSON.parse(localStorage.getItem('orgId'));
    return await axios({
        url,
        headers: {
            'Content-Type': contentType,
            'authorization': token ? `Bearer ${token}` : '',
            'orgid': orgId ? orgId : ''
        },
        method: method,
        data,
        ...options
    });
};

const unAuthRequest = async (method, url, data) => {
	return await axios({
		url,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
		},
		method: method,
		data,
	});
};

// application/json
export const getRequest = (url) => request(json, 'GET', url);
export const postRequest = (url, data) => request(json, 'POST', url, data);
export const putRequest = (url, data) => request(json, 'PUT', url, data);
export const deleteRequest = (url, data) => request(json, 'DELETE', url, data);

// multipart/formData
export const putRequestFormData = (url, data, options = {}) => request(multPart, 'PUT', url, data, options);

//unAuth
export const postUnauthRequest = (url, data) => unAuthRequest('POST', url, data);
export const getUnauthRequest = (url, data) => unAuthRequest('GET', url, data);
