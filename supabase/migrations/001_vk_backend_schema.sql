-- VK Backend Tables Migration
-- This script creates all tables needed for the VK backend API endpoints

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Advocates table (providers/lawyers offering consultations)
CREATE TABLE IF NOT EXISTS advocates (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    availability VARCHAR(50) DEFAULT 'available',
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    location VARCHAR(255),
    profile_image TEXT,
    bio TEXT,
    earnings DECIMAL(10, 2) DEFAULT 0.00,
    hourly_rate DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clients table (consumers seeking consultations)
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    profile_image TEXT,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (authentication tokens)
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('advocate', 'client')),
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Calls table (video/voice calls between users)
CREATE TABLE IF NOT EXISTS calls (
    id SERIAL PRIMARY KEY,
    caller_id INTEGER NOT NULL,
    caller_type VARCHAR(50) NOT NULL CHECK (caller_type IN ('advocate', 'client')),
    receiver_id INTEGER NOT NULL,
    receiver_type VARCHAR(50) NOT NULL CHECK (receiver_type IN ('advocate', 'client')),
    status VARCHAR(50) DEFAULT 'initiated' CHECK (status IN ('initiated', 'accepted', 'ended', 'rejected', 'missed')),
    duration BIGINT DEFAULT 0,
    charge_amount DECIMAL(10, 2),
    payment_id INTEGER,
    scheduled_at TIMESTAMP,
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table (payment transactions)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    client_id INTEGER NOT NULL,
    advocate_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    payment_gateway VARCHAR(50) NOT NULL CHECK (payment_gateway IN ('stripe', 'razorpay', 'test')),
    advocate_commission DECIMAL(10, 2) DEFAULT 0.00,
    platform_fee DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Outbox events table (for event-driven architecture)
CREATE TABLE IF NOT EXISTS outbox_events (
    id SERIAL PRIMARY KEY,
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
    attempts INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

-- Idempotency keys table (for idempotent payment operations)
CREATE TABLE IF NOT EXISTS idempotency_keys (
    key VARCHAR(100) PRIMARY KEY,
    user_id INTEGER NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('advocate', 'client')),
    request_hash VARCHAR(128) NOT NULL,
    response_status INTEGER NOT NULL,
    response_body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_advocates_email ON advocates(email);
CREATE INDEX IF NOT EXISTS idx_advocates_google_id ON advocates(google_id);
CREATE INDEX IF NOT EXISTS idx_advocates_uuid ON advocates(uuid);
CREATE INDEX IF NOT EXISTS idx_advocates_availability_rate ON advocates(availability, hourly_rate);
CREATE INDEX IF NOT EXISTS idx_advocates_location ON advocates(location);

CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_google_id ON clients(google_id);
CREATE INDEX IF NOT EXISTS idx_clients_uuid ON clients(uuid);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id, user_type);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_calls_caller ON calls(caller_id, caller_type);
CREATE INDEX IF NOT EXISTS idx_calls_receiver ON calls(receiver_id, receiver_type);
CREATE INDEX IF NOT EXISTS idx_calls_status ON calls(status);
CREATE INDEX IF NOT EXISTS idx_calls_receiver_type_status ON calls(receiver_id, receiver_type, status);
CREATE INDEX IF NOT EXISTS idx_calls_receiver_schedule ON calls(receiver_id, receiver_type, scheduled_at, started_at);

CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_advocate ON payments(advocate_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

CREATE INDEX IF NOT EXISTS idx_outbox_status ON outbox_events(status);
CREATE INDEX IF NOT EXISTS idx_outbox_status_id ON outbox_events(status, id);

CREATE INDEX IF NOT EXISTS idx_idempotency_expires_at ON idempotency_keys(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_advocates_updated_at BEFORE UPDATE ON advocates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calls_updated_at BEFORE UPDATE ON calls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment advocate earnings (used after payment completion)
CREATE OR REPLACE FUNCTION increment_advocate_earnings(advocate_id INTEGER, amount DECIMAL)
RETURNS VOID AS $$
BEGIN
    UPDATE advocates
    SET earnings = earnings + amount,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = advocate_id;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE advocates IS 'Service providers (lawyers/advocates) offering consultations';
COMMENT ON TABLE clients IS 'Service consumers seeking consultations';
COMMENT ON TABLE sessions IS 'User authentication sessions with JWT-style tokens';
COMMENT ON TABLE calls IS 'Video/voice call records between advocates and clients';
COMMENT ON TABLE payments IS 'Payment transactions for consultations';
COMMENT ON TABLE outbox_events IS 'Outbox pattern for reliable event processing';
COMMENT ON TABLE idempotency_keys IS 'Idempotency keys for safe retries of payment operations';
