import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async(url, formData) => {
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
                },
        });
        
        if (response.ok) {
            const data = await response.json();
            return data;
        }else{
            const errorData = await response.json();
            return errorData;
        }

    } catch (error) {
        console.log("Error: ", error);
    }
}

export const fetchDataFromApi = async(url) => {
    try {
        const { data } = await axios.get(apiUrl + url, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            },
         });
        return data;
    } catch (error) {
        console.log(error);
        return error;
    }
}