const API_BASE="/api/user";

const BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001';

export const register=async(formData)=>{
    const res=await fetch(`${API_BASE}/register`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    });
    return await res.json();
};

export const login=async(formData)=>{
    const res=await fetch(`${API_BASE}/login`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData)
    });
    return await res.json();
}

export const getUser=async()=>{
    const res=await fetch(`${API_BASE}/getUser`,{
        method:"GET",
        headers:{
            Authorization:`Bearer ${token}`,
        },
    });
    return await res.json();
};

export default BASE_URL;