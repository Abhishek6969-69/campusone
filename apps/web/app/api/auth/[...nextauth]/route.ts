import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcrypt";

// Extend NextAuth types to include custom properties
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      collegeId: string;
      collegeName?: string;
      rollNo?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
    };
    accessToken?: string;
  }
  
  interface User {
    id: string;
    role: string;
    collegeId: string;
    collegeName?: string;
    rollNo?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    collegeId: string;
    collegeName?: string;
    rollNo?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
  }
}

// This is the secret used by both NextAuth and the microservices
const JWT_SECRET = "1fa5a2ede80c596e194c53be8216445230f791c6964aa1dd9d7b9bee435985ab";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        try {
          // Find the user with their college info
          const foundUser = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { college: true },
          });

          if (!foundUser) {
            return null;
          }

          // Verify password
          const isValid = await bcrypt.compare(credentials.password, foundUser.password);
          if (!isValid) return null;

          // Return authorized user data
          return {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            collegeId: foundUser.collegeId,
            collegeName: foundUser.college?.name,
            rollNo: foundUser.rollNo ?? undefined,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback - Input token:', token);
      console.log('JWT Callback - Input user:', user);
      
      // Create token data from user or existing token
      const tokenData = {
        id: user?.id || token.id,
        email: user?.email || token.email,
        role: user?.role || token.role,
        collegeId: user?.collegeId || token.collegeId,
        name: user?.name || token.name,
      };

      console.log('Creating access token with data:', tokenData);
      
      // Generate JWT using the shared secret
      const jwt = require('jsonwebtoken');
      const accessToken = jwt.sign(tokenData, JWT_SECRET, { expiresIn: '1d' });
      
      console.log('Generated new access token');

      return {
        ...token,
        ...tokenData,
        accessToken,
      };
    },
    async session({ session, token }) {
      console.log('Session Callback - Input token:', token);
      
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
          collegeId: token.collegeId,
          collegeName: token.collegeName,
          rollNo: token.rollNo,
          email: token.email,
          name: token.name,
          accessToken: token.accessToken,
        },
        accessToken: token.accessToken,
      };
    },
  },
  pages: {
    signIn: "/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
