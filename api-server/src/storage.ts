import { db, waitlistTable } from "@workspace/db";
import { sql, eq } from "drizzle-orm";

export class Storage {
  async getProduct(productId: string) {
    const result = await db.execute(
      sql`SELECT * FROM stripe.products WHERE id = ${productId}`
    );
    return result.rows[0] || null;
  }

  async listProductsWithPrices() {
    const result = await db.execute(sql`
      WITH paginated_products AS (
        SELECT id, name, description, metadata, active
        FROM stripe.products
        WHERE active = true
        ORDER BY id
      )
      SELECT
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.metadata as product_metadata,
        pr.id as price_id,
        pr.unit_amount,
        pr.currency,
        pr.type as price_type,
        pr.active as price_active
      FROM paginated_products p
      LEFT JOIN stripe.prices pr ON pr.product = p.id AND pr.active = true
      ORDER BY p.id, pr.unit_amount
    `);
    return result.rows;
  }

  async addToWaitlist(data: {
    email: string;
    name?: string;
    phone?: string;
    tier: string;
    stripeSessionId?: string;
  }) {
    const [entry] = await db
      .insert(waitlistTable)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return entry;
  }

  async markWaitlistPaid(sessionId: string, customerId: string) {
    const [entry] = await db
      .update(waitlistTable)
      .set({ paid: true, stripeCustomerId: customerId })
      .where(eq(waitlistTable.stripeSessionId, sessionId))
      .returning();
    return entry;
  }

  async getWaitlistStats() {
    const result = await db.execute(sql`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN tier = 'one_month' THEN 1 ELSE 0 END) as one_month,
        SUM(CASE WHEN tier = 'early_access' THEN 1 ELSE 0 END) as early_access,
        SUM(CASE WHEN tier = 'two_year' THEN 1 ELSE 0 END) as two_year,
        SUM(CASE WHEN paid = true THEN 1 ELSE 0 END) as paid_total,
        SUM(CASE WHEN paid = true AND tier = 'one_month' THEN 1 ELSE 0 END) as paid_one_month,
        SUM(CASE WHEN paid = true AND tier = 'early_access' THEN 1 ELSE 0 END) as paid_early_access,
        SUM(CASE WHEN paid = true AND tier = 'two_year' THEN 1 ELSE 0 END) as paid_two_year,
        SUM(CASE WHEN paid = true AND tier = 'one_month' THEN 199 ELSE 0 END) as one_month_revenue_cents,
        SUM(CASE WHEN paid = true AND tier = 'early_access' THEN 499 ELSE 0 END) as early_access_revenue_cents,
        SUM(CASE WHEN paid = true AND tier = 'two_year' THEN 4499 ELSE 0 END) as two_year_revenue_cents
      FROM waitlist
    `);
    const row = result.rows[0] as any;
    return {
      total: parseInt(row.total) || 0,
      one_month: parseInt(row.one_month) || 0,
      early_access: parseInt(row.early_access) || 0,
      two_year: parseInt(row.two_year) || 0,
      paid_total: parseInt(row.paid_total) || 0,
      paid_one_month: parseInt(row.paid_one_month) || 0,
      paid_early_access: parseInt(row.paid_early_access) || 0,
      paid_two_year: parseInt(row.paid_two_year) || 0,
      one_month_revenue_cents: parseInt(row.one_month_revenue_cents) || 0,
      early_access_revenue_cents: parseInt(row.early_access_revenue_cents) || 0,
      two_year_revenue_cents: parseInt(row.two_year_revenue_cents) || 0,
      total_revenue_cents:
        (parseInt(row.one_month_revenue_cents) || 0) +
        (parseInt(row.early_access_revenue_cents) || 0) +
        (parseInt(row.two_year_revenue_cents) || 0),
    };
  }

  async listWaitlist(limit = 50, offset = 0) {
    const result = await db.execute(sql`
      SELECT
        id, email, name, phone, tier, stripe_session_id, stripe_customer_id,
        CASE WHEN paid = true THEN 'paid' ELSE 'pending' END as payment_status,
        created_at
      FROM waitlist
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    return result.rows;
  }
}

export const storage = new Storage();
