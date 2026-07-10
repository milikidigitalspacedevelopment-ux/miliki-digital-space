import * as authService from "../services/authService.js";

async function register(req, res, next) {
  try {
    const { name, email, password, role, profile } = req.body;
    const result = await authService.register({ name, email, password, role, profile });
    res.status(201).json({
      user: result.user,
      accessToken: result.accessToken,
      token: result.accessToken,
      refreshToken: result.refreshToken,
      message: result.message,
      checkpoint: result.checkpoint,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password, rememberMe } = req.body;
    const result = await authService.login({ email, password, rememberMe });
    res.json({
      user: result.user,
      accessToken: result.accessToken,
      token: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    console.log("Error in authController login:", err.message);
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { token } = req.body;
    const result = await authService.refresh({ token });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const { token } = req.body;
    await authService.logout({ token });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const result = await authService.resetPassword({ token, password });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;
    const result = await authService.verifyEmail(token);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function resendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;
    const result = await authService.resendVerificationEmail(email);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function authorizeGoogle(req, res, next) {
  try {
    const url = authService.getGoogleAuthUrl();
    res.redirect(url);
  } catch (err) {
    next(err);
  }
}

async function authorizeZoho(req, res, next) {
  try {
    const url = authService.getZohoAuthUrl();
    res.redirect(url);
  } catch (err) {
    next(err);
  }
}

async function handleGoogleCallback(req, res, next) {
  try {
    const code = req.query.code;
    if (!code) {
      return res.status(400).json({ message: "Google callback is missing authorization code." });
    }

    const result = await authService.loginWithGoogleCode(code);
    const { user, accessToken, refreshToken } = result;

    const encodedUser = encodeURIComponent(
      Buffer.from(JSON.stringify(user)).toString("base64")
    );
    const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/google/callback?accessToken=${encodeURIComponent(
      accessToken
    )}&token=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}&user=${encodedUser}`;

    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
}

async function handleZohoCallback(req, res, next) {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).json({ message: "Zoho callback is missing authorization code." });

    const result = await authService.loginWithZohoCode(code);
    const { user, accessToken, refreshToken } = result;

    const encodedUser = encodeURIComponent(Buffer.from(JSON.stringify(user)).toString("base64"));
    const redirectUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/zoho/callback?accessToken=${encodeURIComponent(
      accessToken
    )}&token=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}&user=${encodedUser}`;

    res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
}

export {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  authorizeGoogle,
  authorizeZoho,
  handleGoogleCallback,
  handleZohoCallback,
};
