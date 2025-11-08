import jwt from 'jsonwebtoken';

const validateAuthToken = (req, res, next) => {
  try {
    let authToken = req.cookies?.authToken;

    if (!authToken) {
      const authHeader = req.headers.authorization;
      if (authHeader?.startsWith("Bearer ")) {
        authToken = authHeader.slice(7);
      }
    }

    if (!authToken) {
      console.log("validateAuthToken: No token found in cookies or headers")
      return res.status(401).json({
        path: req.url,
        timestamp: new Date(),
        success: false,
        message: "unauthorised request",
      });
    }

    const memberProfile = jwt.verify(authToken, process.env.JWT_SECRET)

    req.member = {
      email: memberProfile.member_email,
      team: memberProfile.member_team,
      role: memberProfile.member_role,
      id: memberProfile.member_id
    };

    next()
  } catch (error) {
    let message = "Invalid token";
    
    if (error.name === 'TokenExpiredError') {
      message = "Token expired";
    } else if (error.name === 'JsonWebTokenError') {
      message = "Invalid token format";
    }

    console.log("validateAuthToken: Validation terminated due to ", message);

    return res.status(401).json({
      path: req.url,
      timestamp: new Date(),
      success: false,
      message: message,
    });
  }
}

export default validateAuthToken;