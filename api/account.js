import { requireUser, sendError } from "../lib/auth.js";
import { supabaseAdmin } from "../lib/supabase-admin.js";

export default async function handler(req, res) {
  try {
    const user = await requireUser(req);
    const [profileResult, walletResult, progressResult, transactionResult] = await Promise.all([
      supabaseAdmin.from("arcade_profiles").select("*").eq("id", user.id).maybeSingle(),
      supabaseAdmin.from("arcade_wallets").select("*").eq("user_id", user.id).maybeSingle(),
      supabaseAdmin.from("arcade_progress").select("*").eq("user_id", user.id).maybeSingle(),
      supabaseAdmin.from("arcade_wallet_transactions")
        .select("amount,type,reference,created_at,metadata")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(25)
    ]);

    const error = profileResult.error || walletResult.error || progressResult.error || transactionResult.error;
    if (error) throw error;

    return res.status(200).json({
      profile: profileResult.data,
      wallet: walletResult.data || { coins: 0 },
      progress: progressResult.data || { xp: 0, vip: 1, settings: {} },
      transactions: transactionResult.data || []
    });
  } catch (error) {
    return sendError(res, error);
  }
}
