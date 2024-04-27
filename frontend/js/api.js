export async function get(url, params, token) {
    url = `${url}?`;
    let returnedData = [];
    let returnedError = '';

    for (const key in params) {
        if (Object.hasOwnProperty.call(params, key)) {
            url.concat(`${key}=${params[key]}`)
        }
    }

    await fetch(url, {
        method: 'GET',
        headers: {
            'mode': 'cors',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw new Error(response.status + '\n' + response.statusText);
        }
    }).then(data => {
        returnedData = data;
    }).catch(error => {
        returnedError = error;
    });

    return { data: returnedData, error: returnedError };
}


export async function post(url, formData, token) {
    let returnedData = [];
    let returnedError = '';

    await fetch(url, {
        method: 'POST',
        headers: {
            'mode': 'cors',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => response.json()
    ).then((data) => {
        returnedData = data;
    }).catch(error => {
        returnedError = error;
    });

    return { data: returnedData, error: returnedError };
}


export async function del(url, token) {
    let returnedError = '';

    await fetch(url, {
        method: 'DELETE',
        headers: {
            'mode': 'cors',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            throw new Error(response.status + '\n' + response.statusText);
        }
    }).catch(error => {
        returnedError = error;
    });

    return { error: returnedError };
}


export async function put(url, formData, token) {
    let returnedData = [];
    let returnedError = '';

    await fetch(url, {
        method: 'PUT',
        headers: {
            'mode': 'cors',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    }).then(response => response.json()
    ).then(data => {
        if (data.detail == null) {
            returnedData = data;
        } else {
            throw new Error(data.detail);
        }
    }).catch(error => {
        returnedError = error;
    });

    return { data: returnedData, error: returnedError };
}


export async function checkToken(url, token) {
    let returnedError = '';

    await fetch(url,
        {
            method: 'POST',
            headers: {
                'mode': 'cors',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }
    ).then(response => {
        if (!response.ok) {
            throw new Error(response.status + '\n' + response.statusText);
        }
    }).catch(error => {
        returnedError = error;
    });

    return { error: returnedError };
}


export async function login(url, formData) {
    let returnedData = [];
    let returnedError = '';

    await fetch(url,
        {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            body: formData
        }
    ).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(response.status + '\n' + response.statusText);
        }
    }).then(data => {
        returnedData = data;
    }).catch(error => {
        returnedError = error;
    });

    return { data: returnedData, error: returnedError };
}