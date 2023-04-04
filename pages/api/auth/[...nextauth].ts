import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials
 from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";
import { signIn } from 'next-auth/react';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    
    // ...add more providers here
    Credentials({
      name: 'Custon Login',
      credentials: {
        email: { label: 'Correo: ', type: 'email', placeholder: 'tu@correo.com'},
        password: { label: 'Contraseña: ', type: 'password', placeholder: 'Contraseña'}
      },
      async authorize(credentials) {
        const user = await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
        if (user) {
          return { ...user, id: user._id };
        }
        return null;
      },
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
  ],
  //Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },


  //callbacks
  jwt: {
    //secret: process.env.NEXTAUTH_SECRET
  },
  session: {
    maxAge: 2592000, // 30 dias
    strategy: 'jwt',
    updateAge: 86400 // cada dias
  },
  callbacks: {

    async jwt({ token, account, user }) {

      if( account ) {
        token.accessToken = account.access_token;

        switch(account.type) {

          case 'oauth':
            token.user = await dbUsers.oAUthToDbUser( user?.email || '', user?.name || '' );
            break;

          case 'credentials':
            token.user = user;
            break;
        }
      }
      
      console.log({ token, account, user });
      return token;
    },

    async session({ session, token, user }){

      session.accessToken = token.accessToken as any;
      session.user = token.user as any;
      return session;
    }



  }
}
export default NextAuth(authOptions);