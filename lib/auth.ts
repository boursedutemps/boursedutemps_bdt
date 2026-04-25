import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function signToken(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

export function getUserIdFromRequest(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  
  try {
    // Décoder le token Supabase sans vérifier la signature
    // Supabase JWT contient "sub" (subject) = l'UID utilisateur
    const decoded: any = jwt.decode(token);
    return decoded?.sub || null;
  } catch (e) {
    return null;
  }
}