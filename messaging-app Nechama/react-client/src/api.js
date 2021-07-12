//http://localhost:3030

export const login = async (userName, password)=> {
    const url = '/api/login';
    const headers = {'Content-Type': 'application/json'}
    const options = {method:'POST',headers, body:JSON.stringify({userName,password})}
    const response = await (await fetch(url,options)).json()
    console.log({response})
    return response;
}
export const logout = async ()=> {
    const url = '/api/logout';
    const response = await (await fetch(url)).json()
    console.log({response})
    return response;
}

