import jwt from 'jsonwebtoken';

const auth = async (req,res,next) => {
    try {
        console.log(req);
        const token = req.headers.authorization.split(" ")[1];
        console.log(token);
        const isCustomAuth = token.length < 500;

        let decodedData; 
        if (token && isCustomAuth) {
            console.log("custom");
            decodedData = jwt.verify(token, 'test');
            console.log(decodedData);
            req.userId = decodedData?.id;
        }else{
            console.log("google");
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    } catch (error) {
        res.status(401).json({message: "Unauthenticated @ auth.js"});
    }
}

export default auth;