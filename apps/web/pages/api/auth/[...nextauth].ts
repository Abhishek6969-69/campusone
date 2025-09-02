import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { User as NextAuthUser, Session } from "next-auth";

// Extend the Session type to include role on user
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }
}

type ExtendedUser = NextAuthUser & { role?: string };

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) throw new Error("User not found");
        // TODO: compare hashed password
        if (credentials.password !== user.password) throw new Error("Invalid password");
        // Return user with role property
        return { ...user, role: user.role } as ExtendedUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as ExtendedUser).role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = typeof token.role === "string" ? token.role : undefined;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // After login, redirect by role
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
    newUser: "/profile", // 🚀 after signup, go to profile setup
  },
});
