import os
import sqlite3
from datetime import datetime, timezone

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)
DB_PATH = os.environ.get("RADAR_DB_PATH", os.path.join(os.path.dirname(__file__), "radar.db"))


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            city TEXT,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            lead_id INTEGER,
            market_value REAL,
            auction_price REAL,
            iptu REAL,
            condo REAL,
            legal_cost REAL,
            renovation REAL,
            court_risk REAL,
            occupancy REAL,
            expected_rent REAL,
            score REAL,
            recommendation TEXT,
            total_cost REAL,
            yield_pct REAL,
            discount_vs_market REAL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(lead_id) REFERENCES leads(id)
        )
        """
    )
    conn.commit()
    conn.close()


init_db()


def assess_property(payload):
    market_value = float(payload.get("market_value", 0) or 0)
    auction_price = float(payload.get("auction_price", 0) or 0)
    iptu = float(payload.get("iptu", 0) or 0)
    condo = float(payload.get("condo", 0) or 0)
    legal_cost = float(payload.get("legal_cost", 0) or 0)
    renovation = float(payload.get("renovation", 0) or 0)
    court_risk = float(payload.get("court_risk", 0) or 0)
    occupancy = float(payload.get("occupancy", 0) or 0)
    expected_rent = float(payload.get("expected_rent", 0) or 0)

    hidden_costs = iptu + condo + legal_cost + renovation + (court_risk * 2500) + (occupancy * 5000)
    total_cost = auction_price + hidden_costs
    annual_cashflow = max(0.0, expected_rent * 12)
    yield_pct = (annual_cashflow / total_cost) * 100 if total_cost else 0

    discount_vs_market = ((market_value - auction_price) / market_value * 100) if market_value else 0
    score = 100
    score -= max(0, (100 - discount_vs_market) * 0.5)
    score -= court_risk * 20
    score -= occupancy * 15
    score -= (max(0.0, renovation - 15000) / 5000) * 5
    score -= (max(0.0, legal_cost - 4000) / 3000) * 3
    score = max(0, min(100, round(score, 1)))

    if score >= 75:
        recommendation = "Aprovar com due diligence"
    elif score >= 55:
        recommendation = "Aprovar apenas com revisão legal e de ocupação"
    else:
        recommendation = "Rejeitar ou renegociar"

    return {
        "market_value": round(market_value, 2),
        "auction_price": round(auction_price, 2),
        "hidden_costs": round(hidden_costs, 2),
        "total_cost": round(total_cost, 2),
        "annual_cashflow": round(annual_cashflow, 2),
        "yield_pct": round(yield_pct, 2),
        "discount_vs_market": round(discount_vs_market, 2),
        "score": score,
        "recommendation": recommendation,
        "risk_flags": {
            "legal": court_risk > 0.5,
            "ocupacao": occupancy > 0.5,
            "reforma": renovation > 20000,
        },
    }


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/lead", methods=["POST"])
def api_create_lead():
    payload = request.get_json(force=True, silent=True) or request.form.to_dict(flat=True)
    name = (payload.get("name") or "").strip()
    email = (payload.get("email") or "").strip()
    phone = (payload.get("phone") or "").strip()
    city = (payload.get("city") or "").strip()

    if not name or not email:
        return jsonify({"status": "error", "message": "name and email are required"}), 400

    conn = get_db_connection()
    cursor = conn.execute(
        "INSERT INTO leads (name, email, phone, city, created_at) VALUES (?, ?, ?, ?, ?)",
        (name, email, phone, city, datetime.now(timezone.utc).isoformat()),
    )
    conn.commit()
    lead_id = cursor.lastrowid
    conn.close()

    return jsonify({"status": "created", "id": lead_id, "name": name, "email": email}), 200


@app.route("/api/assess", methods=["POST"])
def api_assess():
    payload = request.get_json(force=True, silent=True) or request.form.to_dict(flat=True)
    result = assess_property(payload)

    lead_id = payload.get("lead_id")
    if lead_id:
        conn = get_db_connection()
        conn.execute(
            """
            INSERT INTO assessments (
                lead_id, market_value, auction_price, iptu, condo, legal_cost, renovation,
                court_risk, occupancy, expected_rent, score, recommendation, total_cost,
                yield_pct, discount_vs_market, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                int(lead_id),
                float(payload.get("market_value", 0) or 0),
                float(payload.get("auction_price", 0) or 0),
                float(payload.get("iptu", 0) or 0),
                float(payload.get("condo", 0) or 0),
                float(payload.get("legal_cost", 0) or 0),
                float(payload.get("renovation", 0) or 0),
                float(payload.get("court_risk", 0) or 0),
                float(payload.get("occupancy", 0) or 0),
                float(payload.get("expected_rent", 0) or 0),
                float(result["score"]),
                result["recommendation"],
                float(result["total_cost"]),
                float(result["yield_pct"]),
                float(result["discount_vs_market"]),
                datetime.now(timezone.utc).isoformat(),
            ),
        )
        conn.commit()
        conn.close()

    return jsonify(result)


if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
