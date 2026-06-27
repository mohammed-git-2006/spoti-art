import { cookies } from 'next/headers'
import LoginPage from './login'
import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation';
// import { redirect } from 'next/navigation';

export default async function LoginPageContainer()
{
  const redirectUri = process.env.REDIRECT_URI as string;
  const cookiesStore = await cookies();
  
  let checkAuth = () => {
    try {
      const auth = cookiesStore.get('auth');
      if (!auth) return false;
  
      const token = auth.value;
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
  
      if (!payload) return false;
  
      return true;
    } catch (_) {
      return false;
    }
  }
  
  if (checkAuth())
    return redirect('/home')
  

  return <LoginPage redirectUri={redirectUri} />
}