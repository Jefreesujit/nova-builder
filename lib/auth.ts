import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { createServiceClient } from "@/lib/supabase/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        // Check against test credentials
        if (
          email === process.env.TEST_USER_EMAIL &&
          password === process.env.TEST_USER_PASSWORD
        ) {
          let userId = "00000000-0000-0000-0000-000000000000";

          // Ensure test user exists in Supabase Auth to satisfy foreign key constraints
          try {
            const supabase = createServiceClient();

            // First try to find existing user by email
            const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

            if (!listError && users) {
              const existingUser = users.find(u => u.email === email);
              if (existingUser) {
                console.log("Found existing test user:", existingUser.id);
                userId = existingUser.id;
              } else {
                // User doesn't exist, create it with our preferred ID
                console.log("Test user not found in list, creating...");
                const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                  email,
                  password,
                  email_confirm: true,
                  user_metadata: { name: "Test User" },
                  id: userId,
                });

                if (createError) {
                  console.error("Error creating test user:", createError);
                  // If creation failed but it was "email exists" (race condition), we might be stuck
                  // but unlikely given the list check above.
                  // Fallback: If creation failed, we can't do much, but let's hope it worked.
                } else if (newUser.user) {
                  userId = newUser.user.id;
                }
              }
            }
          } catch (err) {
            console.error("Error checking/creating test user:", err);
          }

          return {
            id: userId,
            name: "Test User",
            email: email,
            image: "https://github.com/shadcn.png",
          };
        }

        return null; // Invalid credentials
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        // Create or update user profile in Supabase
        const supabase = createServiceClient();

        // First, check if user exists in Supabase auth
        const { data: existingUsers } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", user.email)
          .single();

        if (!existingUsers) {
          // Create profile for new user
          // Note: We'll use email as the unique identifier for NextAuth users
          const { error } = await supabase.from("profiles").insert({
            id: user.id, // NextAuth user ID
            email: user.email,
            name: user.name || profile?.name,
            avatar_url: user.image || profile?.picture || profile?.avatar_url,
            provider: account?.provider,
          });

          if (error) {
            console.error("Error creating profile:", error);
            // Don't fail sign-in, just log the error
          }
        }

        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return true; // Still allow sign-in even if profile sync fails
      }
    },
    async session({ session, token }) {
      // Add user ID to session
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.provider = account?.provider;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});
