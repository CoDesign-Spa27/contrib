import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.NEXT_GITHUB_CLIENT_ID ?? process.env.AUTH_GITHUB_ID ?? "",
      clientSecret:
        process.env.NEXT_GITHUB_CLIENT_SECRET ?? process.env.AUTH_GITHUB_SECRET ?? "",
      authorization: {
        params: {
          scope: "repo",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
});
