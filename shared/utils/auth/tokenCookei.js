import Cookies from "cookies";

// set access and refresh JWT tokens as httpOnly cookies
export const cookieGenerator = (tknInf, token, req, res) => {
  const cookies = new Cookies(req, res);
  const isSecure = process.env.NODE_ENV === 'production'; // Set secure for production (HTTPS)

  cookies.set(tknInf.type, token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: tknInf.age * 1000,
  });
};

export const deleteCookie = (type, req, res) => {
  const cookies = new Cookies(req, res);
  const isSecure = process.env.NODE_ENV === 'production'; // Set secure for production (HTTPS)
  cookies.set(type, "", {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 1
  });
};

export const isAdminCookie = (req, res, isAdmin) => {
  const cookies = new Cookies(req, res);
  const isSecure = process.env.NODE_ENV === 'production'; // Set secure for production (HTTPS)
  cookies.set("isAdmin", `${isAdmin}`, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
  });
};
export const isAdminDelete = (req, res) => {
  const cookies = new Cookies(req, res);
  const isSecure = process.env.NODE_ENV === 'production'; // Set secure for production (HTTPS)
  cookies.set("isAdmin", "", {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    maxAge: 1
  });
};
