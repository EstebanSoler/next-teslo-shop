import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
 
 
export async function middleware(req: NextRequest) {
    const session: any = await getToken({ req, secret: process.env.JWT_SECRET_SEED});
    console.log({session});

    if( !session ) {
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${ requestedPage }`;

        if (requestedPage.startsWith('/api/admin')) {
            return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
        }

        return NextResponse.redirect(url);
    }

    const validRoles = ['admin', 'super-user', 'SEO'];

    if (req.nextUrl.pathname.startsWith('/admin')) {
        if (!validRoles.includes(session.user.role)) {
          return NextResponse.redirect(new URL('/', req.url));
        }
      }
     
    if (req.nextUrl.pathname.startsWith('/api/admin')) {
        if (!validRoles.includes(session.user.role)) {
            return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
        }
    }
    
    return NextResponse.next();

    
}
 
export const config = {
    matcher: ['/checkout/address', '/checkout/summary', '/admin/:path*', '/api/admin/:path*'],
};