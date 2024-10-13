import axios from "axios";

const verifyAccessToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    axios.get(process.env.USER_AUTH_URL, {
        headers: { Authorization: authHeader },
        withCredentials: true

    }).then((userRes) => {
        if (userRes.status === 200) {
            req.userIsAdmin = userRes.data.data.isAdmin;
            next();
        } else {
            return res.status(userRes.status).json({ message: userRes.data.message });
        }

    }).catch((error) => {
        console.log(error);
        return res.status(500).json({ message: "Unable to authenticate user" });
    });
};

const verifyAdmin = (req, res, next) => {
    if (req.userIsAdmin) {  // field is passed from previous layer
        next();
    } else {
        return res.status(403).json({ message: "Not authorized to access this resource" });
    }
}

export { verifyAccessToken, verifyAdmin };
