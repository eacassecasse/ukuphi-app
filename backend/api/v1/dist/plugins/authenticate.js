"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.generateRefreshToken = generateRefreshToken;
async function authenticate(request, reply) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({
            message: "Unauthorized",
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = request.jwt.verify(token);
        const refreshToken = await generateRefreshToken(request, decoded);
        reply.setCookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
        });
        request.user = decoded;
    }
    catch (error) {
        return reply.status(401).send({
            message: "Unauthorized",
        });
    }
}
async function generateRefreshToken(request, user) {
    const refreshToken = request.jwt.sign(user, {
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
    });
    return refreshToken;
}
