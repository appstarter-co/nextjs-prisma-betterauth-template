import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { jwtClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  plugins: [jwtClient() , inferAdditionalFields<typeof auth>()],
});