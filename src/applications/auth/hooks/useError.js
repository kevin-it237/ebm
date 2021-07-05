import { useEffect } from 'react';

/**
 * @description handles errors from the reducer. 
 * @param {any} error 
 * @param {array} callbacks array of functions you want to perform. 
 */
const useError = (error, callbacks = []) =>
{
    useEffect(()=>
    {
        if(!callbacks.length || !error) return; 

        callbacks.forEach(async callback => {
            await setTimeout(callback, 10);
        });

    }, [error]);
}

export default useError;