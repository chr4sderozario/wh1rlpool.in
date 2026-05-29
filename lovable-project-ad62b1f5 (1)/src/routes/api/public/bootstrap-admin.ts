import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_EMAIL = "sohanjohn@wh1rlpool.com";
const ADMIN_PASSWORD = "admin6291923478";

export const Route = createFileRoute("/api/public/bootstrap-admin")({
  server: {
    handlers: {
      GET: async () => {
        const { data: list } = await supabaseAdmin.auth.admin.listUsers();
        const existing = list?.users.find((u) => u.email === ADMIN_EMAIL);
        let userId = existing?.id;

        if (!userId) {
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
            email_confirm: true,
            user_metadata: { full_name: "Sohan John" },
          });
          if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });
          userId = data.user!.id;
        }

        // ensure admin role
        await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: userId!, role: "admin" }, { onConflict: "user_id,role" });

        return Response.json({ ok: true, userId });
      },
    },
  },
});
