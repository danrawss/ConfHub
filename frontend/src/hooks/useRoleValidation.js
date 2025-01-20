import { useEffect } from "react";
import axios from "axios";

const useRoleValidation = (expectedRole) => {
    useEffect(() => {
        const validateRole = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                window.location.href = "/login";
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/auth/role`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.role !== expectedRole) {
                    alert("You are not authorized to access this page.");
                    window.location.href = `/${response.data.role}-dashboard`; 
                }
            } catch (error) {
                console.error("Error validating role:", error);
                window.location.href = "/login";
            }
        };

        validateRole();
    }, [expectedRole]);
};

export default useRoleValidation;
