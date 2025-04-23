import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";
const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Webhook secret not set");
    }

    const svix_id = request.headers.get("svix-id");
    const svix_sig = request.headers.get("svix-signature");
    const svix_timestamp = request.headers.get("svix-timestamp");

    if (!svix_id || !svix_sig || !svix_timestamp) {
      throw new Error("Missing svix headers");
    }

    const payload = await request.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret, {});
    let event: any;

    try {
      event = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_sig,
        "svix-timestamp": svix_timestamp,
      }) as any;
    } catch (error) {
      console.error("Error verifying webhook", error);
      throw new Error("Error verifying webhook");
    }

    const eventType = event.type;

    if (eventType === "user.created") {
      const userId = event.data.id;
      const email = event.data.email_addresses[0].email_address;
      const firstName = event.data.first_name;
      const lastName = event.data.last_name;
      const imageUrl = event.data.image_url;

      const name = `${firstName || ""} ${lastName || ""}`.trim();

      try {
        await ctx.runMutation(api.users.createUser, {
          email,
          fullname: name,
          image: imageUrl,
          clerkId: userId,
          username: email.split("@")[0],
        });
      } catch (error) {
        console.error("Error creating user", error);
        throw new Error("Error creating user");
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});


export default http;