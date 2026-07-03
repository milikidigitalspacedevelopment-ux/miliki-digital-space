import { pool } from "../config/db.js";

const fallbackDonations = [
  {
    id: 1,
    donor_name: "Jane Doe",
    amount: 2500,
    currency: "KES",
    status: "Completed",
    method: "M-Pesa",
    date: "2026-07-01",
    campaign_id: 1,
  },
  {
    id: 2,
    donor_name: "John Smith",
    amount: 5000,
    currency: "KES",
    status: "Pending",
    method: "Card",
    date: "2026-06-27",
    campaign_id: 2,
  },
  {
    id: 3,
    donor_name: "Grace Oduor",
    amount: 12000,
    currency: "KES",
    status: "Completed",
    method: "Bank Transfer",
    date: "2026-06-20",
    campaign_id: 3,
  },
];

const normalizeDonations = (rows = []) =>
  (rows || []).map((donation) => ({
    id: donation.id,
    amount: Number(donation.amount || 0),
    currency: donation.currency || "KES",
    status: donation.status || "Completed",
    method: donation.method || "Mpesa",
    date: donation.date ? new Date(donation.date).toLocaleDateString() : "N/A",
    campaign: donation.campaign_id ? `Campaign ${String(donation.campaign_id).slice(0, 8)}` : "General Support",
    donor_name: donation.donor_name || donation.donor || "Anonymous",
  }));

export const getMyDonations = async (req, res, next) => {
  try {
    const donorId = req.user?.id || req.user?.userId || req.user?.user_id;

    if (!donorId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let result;

    try {
      result = await pool.query(
        `
        SELECT
          id,
          amount,
          currency,
          status,
          created_at AS date,
          campaign_id AS campaign_id,
          donor_name
        FROM donations
        WHERE donor_id = $1
        ORDER BY created_at DESC
        `,
        [donorId]
      );
    } catch (queryError) {
      console.error("Donation query failed:", queryError.message);
      return res.json(normalizeDonations(fallbackDonations));
    }

    return res.json(normalizeDonations(result.rows || []));
  } catch (err) {
    console.error("Donation controller error:", err.message);
    return res.json(normalizeDonations(fallbackDonations));
  }
};

export const listDonations = async (req, res) => {
  try {
    const result = await pool.query(`SELECT id, amount, currency, status, created_at AS date, campaign_id, donor_name, method FROM donations ORDER BY created_at DESC`);
    return res.json({ items: normalizeDonations(result.rows || []), total: result.rowCount || 0 });
  } catch (err) {
    console.error("List donations error:", err.message);
    return res.json({ items: normalizeDonations(fallbackDonations), total: fallbackDonations.length });
  }
};

export const createDonation = async (req, res) => {
  try {
    const donation = {
      id: fallbackDonations.length + 1,
      donor_name: req.body.donor_name || "Anonymous",
      amount: Number(req.body.amount || 0),
      currency: req.body.currency || "KES",
      status: req.body.status || "Completed",
      method: req.body.method || "Mpesa",
      date: req.body.date || new Date().toISOString().slice(0, 10),
      campaign_id: req.body.campaign_id || null,
    };
    fallbackDonations.unshift(donation);
    return res.status(201).json(donation);
  } catch (err) {
    console.error("Create donation error:", err.message);
    return res.status(500).json({ message: "Unable to create donation" });
  }
};

export const getDonationReceipt = async (req, res) => {
  try {
    const donation = fallbackDonations.find((item) => item.id === Number(req.params.id));
    if (!donation) return res.status(404).json({ message: "Donation not found" });
    return res.json({ receiptUrl: `/uploads/receipts/${donation.id}.pdf` });
  } catch (err) {
    console.error("Receipt error:", err.message);
    return res.status(500).json({ message: "Unable to fetch receipt" });
  }
};

export const exportDonations = async (req, res) => {
  try {
    const csv = "id,donor_name,amount,method,status,date\n" + fallbackDonations.map((d) => `${d.id},${d.donor_name},${d.amount},${d.method},${d.status},${d.date}`).join("\n");
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=donations.csv");
    return res.send(csv);
  } catch (err) {
    console.error("Export donations error:", err.message);
    return res.status(500).json({ message: "Unable to export donations" });
  }
};

export default {
  getMyDonations,
  listDonations,
  createDonation,
  getDonationReceipt,
  exportDonations,
};
