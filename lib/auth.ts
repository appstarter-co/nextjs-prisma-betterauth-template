import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    resetPasswordTokenExpiresIn: 3600 * 24, // 1 hour
    sendResetPassword: async ({ user, url, token }, request) => {
      console.log(`Send password reset email to ${user.email} with URL: ${url} and token: ${token}`);
    },
    onPasswordReset: async ({ user }, request) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  //session: {
    //testing with shorter expiry
		//expiresIn: 60 * 30,  //30 minutes
		//updateAge: 60 * 10,  // Refresh session expiration every 10 minutes
  //},
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => {
          return {
            id: user.id,
            email: user.email,
          };
        },
      },
    }),
  ],
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      phoneNumber: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      facebook: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      instagram: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      twitter: {
        type: "string",
        required: false,
        defaultValue: "",
      },
      linkedin: {
        type: "string",
        required: false,
        defaultValue: "",
      },
    },
  },
  socialProviders: {
    //uncomment and fill the config in .env to enable social providers
    /*google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/google",
      accessType: "offline",
      prompt: "consent",
    },
    github: {
      clientId: "your-client-id",
      clientSecret: "your-client-secret",
      redirectURI: process.env.BETTER_AUTH_URL + "/api/auth/callback/github",
    },
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    }*/
  },
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [
    'http://localhost:3000' // Add your local development origin here
  ],
  //uncomment to enable custom logging
  logger: {
		level: "debug"
	}
});
