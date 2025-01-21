import axios from 'axios';
const apiUrl = import.meta.env.VITE_API_URL;

export const postData = async(url, formData) => {
    try {

        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
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


export const fetchDataFromApi = async (url) => {
    try {
        const params = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.get(apiUrl + url, params);
        return data;
    } catch (error) {
        console.error("Error fetching data from API:", error);
        return error.response ? error.response.data : error.message;
    }
};
