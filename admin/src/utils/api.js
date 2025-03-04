import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Consistent token key
});

/** POST Request */
export const postData = async (url, formData) => {
  try {
    const response = await axios.post(apiUrl + url, formData, {
      headers: {
        ...getAuthHeader(),
        // "Content-Type": "application/json",
      },
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Error in postData:", error);
    return error.response ? error.response.data : { message: error.message, error: true };
  }
};



/** GET Request */
export const fetchDataFromApi = async (url) => {
  try {
    const response = await axios.get(apiUrl + url, {
      headers: {
        ...getAuthHeader(),
      },
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Error fetching data from API:", error);
    return error.response ? error.response.data : { message: error.message, error: true };
  }
};

/** Image Upload (PUT) */
export const uploadImage = async (url, formData) => {
  try {
    const response = await axios.put(apiUrl + url, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data", // Required for file uploads
      },
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Error uploading image:", error);
    return error.response ? error.response.data : { message: error.message, error: true };
  }
};

/** Image Upload (POST) */
export const uploadImagePost = async (url, formData) => {
  try {
    const response = await axios.post(apiUrl + url, formData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "multipart/form-data", // Required for file uploads
      },
    });
    console.log('Image uploaded:', response.data);
    return response.data; // Return response data (e.g., image URL)
  } catch (error) {
    console.error("Error uploading image:", error);
    return error.response ? error.response.data : { message: error.message, error: true };
  }
};

/** Image delete (DELETE) */
export const deleteImages = async (url, image) => {
  try {
    const response = await axios.delete(apiUrl + url, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json", // Required for file uploads
      },
    });
    console.log('Image removed:', response.data);
    return response.data; // Return response data (e.g., image URL)
  } catch (error) {
    console.error("Error removing image:", error);
    return error.response ? error.response.data : { message: error.message, error: true };
  }
};

/** Edit Data (PUT) */
export const editData = async (url, updatedData) => {
  try {
    const response = await axios.put(apiUrl + url, updatedData, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",  
      },
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Error editing data:", error);
    return error.response ? error.response.data : { message: error.message, error: true };
  }
};

/** Delete Data (DELETE) */
export const deleteData = async (url) => {
  try {
    const response = await axios.delete(apiUrl + url, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json",  
      },
    });
    return response.data; // Return response data
  } catch (error) {
    console.error("Error deleting data:", error);
    return error.response ? error.response.data : { message: error.message, error: true };
  }
};


/** Delete Data (POST) for multiple products */
export const deleteMultipleData = async (url) => {
  try {
    const response = await axios.post(apiUrl + url, {}, {
      headers: {
        ...getAuthHeader(),
        "Content-Type": "application/json", // Setting content type as JSON
      },
    });

    return response.data; // Return response data
  } catch (error) {
    console.error("Error deleting data:", error);
    return error.response ? error.response.data : { message: error.message, error: true };
  }
};