import type { RealtimeChannel } from "@supabase/supabase-js";
import { makeRestSupabaseServiceClient } from "@/lib/rest/supabase-server";

type RestDashboardEvent = "reservation_changed" | "waitlist_changed";

function waitForChannelSubscription(
  channel: RealtimeChannel,
  timeoutMs: number,
): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;

    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      resolve(false);
    }, timeoutMs);

    channel.subscribe((status) => {
      if (settled) return;

      if (status === "SUBSCRIBED") {
        settled = true;
        clearTimeout(timer);
        resolve(true);
        return;
      }

      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
        settled = true;
        clearTimeout(timer);
        resolve(false);
      }
    });
  });
}

export async function emitRestDashboardEvent(params: {
  restaurantId: string;
  event: RestDashboardEvent;
  payload?: Record<string, unknown>;
}): Promise<void> {
  const client = makeRestSupabaseServiceClient();
  const channel = client.channel(`rest-dashboard-${params.restaurantId}`);

  try {
    const subscribed = await waitForChannelSubscription(channel, 1500);
    if (!subscribed) return;

    await channel.send({
      type: "broadcast",
      event: params.event,
      payload: {
        ...params.payload,
        restaurantId: params.restaurantId,
        ts: new Date().toISOString(),
      },
    });
  } catch {
    // Realtime is best-effort; mutations must still succeed when transport is unavailable.
  } finally {
    await client.removeChannel(channel);
  }
}
