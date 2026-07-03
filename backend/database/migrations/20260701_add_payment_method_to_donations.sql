ALTER TABLE donations
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Mpesa';
