import Cookies from "js-cookie";
import { useAuth } from "./auth_provider";
import DZHomepage from "./dz_home";
import FRHomepage from "./fr_home";

const Homepage = () => {
    const auth = useAuth();
    
   
    return (
        <div>
            {auth.user.is_fr ? <FRHomepage /> : <DZHomepage />}
        </div>
    );
};

export default Homepage;