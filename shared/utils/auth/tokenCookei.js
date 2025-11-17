import Cookies from "cookies";

// set access and refresh JWT tokens as httpOnly cookies
export const cookieGenerator = (tknInf, token, req, res) => {
  const cookies = new Cookies(req, res);
  const isProduction = process.env.NODE_ENV === 'production';

  cookies.set(tknInf.type, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
    maxAge: tknInf.age * 1000,
  });
};

export const deleteCookie = (type, req, res) => {
  const cookies = new Cookies(req, res);
  const isProduction = process.env.NODE_ENV === 'production';
  cookies.set(type, "", { 
    httpOnly: true, 
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
    maxAge: 1 
  });
};

export const isAdminCookie = (req, res, isAdmin) => {
  const cookies = new Cookies(req, res);
  const isProduction = process.env.NODE_ENV === 'production';
  cookies.set("isAdmin", `${isAdmin}`, { 
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
  });
};
export const isAdminDelete = (req, res) => {
  const cookies = new Cookies(req, res);
  const isProduction = process.env.NODE_ENV === 'production';
  cookies.set("isAdmin", "", { 
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'lax' : 'lax',
    maxAge: 1 
  });
};
