import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { APIsRoutes, baseURL } from "../utils/services/ApiService"

const useUser = () => {
    const { data } = useQuery({
        queryKey: ['profile'],
        queryFn: () => {
            return axios.get(baseURL+APIsRoutes.User.Profile.path, { headers: {
                'session-id': localStorage.getItem('session-id')
            }});
        }
    });

    return {
        user: data?.data,
    }
}

export default useUser;