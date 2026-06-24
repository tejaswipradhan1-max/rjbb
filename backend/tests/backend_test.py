"""Backend API tests for Rajkumari Luxury Spices."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://shuddh-essence.preview.emergentagent.com').rstrip('/')
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@rajkumari.in"
ADMIN_PASS = "Royal@2026"

session = requests.Session()
session.headers.update({"Content-Type": "application/json"})


# -------- Fixtures --------
@pytest.fixture(scope="module")
def admin_token():
    r = session.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASS})
    assert r.status_code == 200, f"Admin login failed: {r.text}"
    data = r.json()
    assert "token" in data and data["user"]["role"] == "admin"
    return data["token"]


@pytest.fixture(scope="module")
def user_creds():
    suffix = uuid.uuid4().hex[:8]
    return {"name": "Test User", "email": f"TEST_{suffix}@example.com", "password": "TestPass@123"}


@pytest.fixture(scope="module")
def user_token(user_creds):
    r = session.post(f"{API}/auth/register", json=user_creds)
    assert r.status_code == 200, f"Register failed: {r.text}"
    data = r.json()
    assert "token" in data and data["user"]["role"] == "user"
    return data["token"]


# -------- Tests --------
# Root
def test_root():
    r = session.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data["brand"] == "Rajkumari"


# Products
def test_list_products_has_4_seeded():
    r = session.get(f"{API}/products")
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    assert len(items) >= 4
    slugs = {p["slug"] for p in items}
    expected = {"shuddh-haldi", "shuddh-mirchi", "shuddh-dhaniya", "royal-garam-masala"}
    assert expected.issubset(slugs), f"Missing slugs: {expected - slugs}"
    # _id should be excluded
    assert "_id" not in items[0]


def test_get_product_by_slug():
    r = session.get(f"{API}/products/shuddh-haldi")
    assert r.status_code == 200
    p = r.json()
    assert p["slug"] == "shuddh-haldi"
    assert p["name"] == "Rajkumari Shuddh Haldi"
    assert p["price_inr"] == 449.0


def test_get_product_not_found():
    r = session.get(f"{API}/products/does-not-exist")
    assert r.status_code == 404


# Auth
def test_register_and_login(user_token, user_creds):
    # Login with same creds
    r = session.post(f"{API}/auth/login", json={"email": user_creds["email"], "password": user_creds["password"]})
    assert r.status_code == 200
    assert "token" in r.json()


def test_register_duplicate(user_creds, user_token):
    r = session.post(f"{API}/auth/register", json=user_creds)
    assert r.status_code == 400


def test_login_invalid():
    r = session.post(f"{API}/auth/login", json={"email": "nope@example.com", "password": "wrong"})
    assert r.status_code == 401


def test_auth_me(user_token):
    r = session.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {user_token}"})
    assert r.status_code == 200
    u = r.json()
    assert u["role"] == "user"
    assert "password" not in u
    assert "_id" not in u


def test_auth_me_no_token():
    r = requests.get(f"{API}/auth/me")
    assert r.status_code == 401


# Admin endpoints
def test_admin_orders_as_admin(admin_token):
    r = session.get(f"{API}/admin/orders", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_admin_users_as_admin(admin_token):
    r = session.get(f"{API}/admin/users", headers={"Authorization": f"Bearer {admin_token}"})
    assert r.status_code == 200
    users = r.json()
    assert isinstance(users, list)
    # password should NOT be in response
    assert all("password" not in u for u in users)
    assert all("_id" not in u for u in users)


def test_admin_orders_forbidden_for_user(user_token):
    r = session.get(f"{API}/admin/orders", headers={"Authorization": f"Bearer {user_token}"})
    assert r.status_code == 403


def test_admin_users_forbidden_for_user(user_token):
    r = session.get(f"{API}/admin/users", headers={"Authorization": f"Bearer {user_token}"})
    assert r.status_code == 403


# Checkout
@pytest.fixture(scope="module")
def first_product():
    r = session.get(f"{API}/products")
    return r.json()[0]


def test_checkout_session_creation(user_token, first_product):
    payload = {
        "items": [{"product_id": first_product["id"], "quantity": 2}],
        "origin_url": BASE_URL,
    }
    r = session.post(
        f"{API}/checkout/session",
        json=payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert r.status_code == 200, f"Checkout failed: {r.text}"
    data = r.json()
    assert "url" in data and data["url"].startswith("http")
    assert "session_id" in data and data["session_id"]
    assert "order_id" in data
    # Save session_id for next test
    pytest.shared_session_id = data["session_id"]


def test_checkout_status(user_token):
    sid = getattr(pytest, "shared_session_id", None)
    assert sid, "Need prior checkout session"
    r = session.get(f"{API}/checkout/status/{sid}")
    assert r.status_code == 200
    data = r.json()
    assert data["session_id"] == sid
    assert "payment_status" in data
    assert "status" in data
    assert data["currency"] == "inr" or data["currency"] is None or data["currency"] == "INR"


def test_checkout_empty_cart(user_token):
    r = session.post(
        f"{API}/checkout/session",
        json={"items": [], "origin_url": BASE_URL},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert r.status_code == 400


def test_checkout_invalid_product(user_token):
    r = session.post(
        f"{API}/checkout/session",
        json={"items": [{"product_id": "not-a-product", "quantity": 1}], "origin_url": BASE_URL},
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert r.status_code == 400


# Orders mine
def test_orders_mine(user_token):
    r = session.get(f"{API}/orders/mine", headers={"Authorization": f"Bearer {user_token}"})
    assert r.status_code == 200
    items = r.json()
    assert isinstance(items, list)
    # Our user just created a checkout - should have at least one order
    assert len(items) >= 1


# ---- UPI manual flow ----
def test_upi_checkout_create(user_token, first_product):
    payload = {
        "items": [{"product_id": first_product["id"], "quantity": 2}],
        "customer_name": "TEST_UPI_USER",
        "customer_phone": "9999988888",
    }
    r = session.post(
        f"{API}/checkout/upi",
        json=payload,
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert r.status_code == 200, f"UPI create failed: {r.text}"
    data = r.json()
    # Validate required fields
    for key in ("order_id", "short_ref", "total_inr", "merchant_upi_id",
                "merchant_name", "upi_link", "qr_url"):
        assert key in data, f"Missing key {key} in response"
    # Total must equal price*qty
    assert data["total_inr"] == round(float(first_product["price_inr"]) * 2, 2)
    # UPI link must use upi:// scheme and contain pa/am/cu
    assert data["upi_link"].startswith("upi://pay?")
    assert f"pa={data['merchant_upi_id']}" in data["upi_link"]
    assert f"am={data['total_inr']:.2f}" in data["upi_link"]
    assert "cu=INR" in data["upi_link"]
    assert f"RJK-{data['short_ref']}" in data["upi_link"]
    # short_ref must be 8 upper chars
    assert len(data["short_ref"]) == 8 and data["short_ref"].isupper()
    # qr_url should point to qrserver and embed upi_link
    assert "api.qrserver.com" in data["qr_url"]
    # Save for downstream tests
    pytest.shared_upi_order_id = data["order_id"]


def test_upi_get_order_persisted():
    oid = getattr(pytest, "shared_upi_order_id", None)
    assert oid, "Need prior UPI order"
    r = session.get(f"{API}/orders/{oid}")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == oid
    assert data["payment_method"] == "upi"
    assert data["payment_status"] == "awaiting_payment"
    assert data["status"] == "awaiting_payment"
    assert data["customer_name"] == "TEST_UPI_USER"
    assert data["customer_phone"] == "9999988888"
    assert "_id" not in data


def test_upi_confirm_short_reference_400():
    oid = getattr(pytest, "shared_upi_order_id", None)
    assert oid
    r = session.post(f"{API}/checkout/upi/{oid}/confirm", json={"upi_reference": "abc"})
    assert r.status_code == 400


def test_upi_confirm_success_moves_to_verifying():
    oid = getattr(pytest, "shared_upi_order_id", None)
    assert oid
    r = session.post(f"{API}/checkout/upi/{oid}/confirm", json={"upi_reference": "TXN1234567890"})
    assert r.status_code == 200
    assert r.json().get("status") == "verifying"
    # Verify persistence
    g = session.get(f"{API}/orders/{oid}").json()
    assert g["payment_status"] == "verifying"
    assert g["status"] == "verifying"
    assert g["upi_reference"] == "TXN1234567890"


def test_upi_confirm_unknown_order_404():
    r = session.post(f"{API}/checkout/upi/{uuid.uuid4()}/confirm",
                     json={"upi_reference": "TXN9999"})
    assert r.status_code == 404


def test_upi_checkout_empty_cart():
    r = session.post(f"{API}/checkout/upi", json={"items": []})
    assert r.status_code == 400


def test_upi_checkout_invalid_product():
    r = session.post(f"{API}/checkout/upi",
                     json={"items": [{"product_id": "bogus-id", "quantity": 1}]})
    assert r.status_code == 400


def test_get_order_unknown_404():
    r = session.get(f"{API}/orders/{uuid.uuid4()}")
    assert r.status_code == 404


# ---- Admin mark-paid ----
def test_admin_mark_paid_forbidden_for_user(user_token):
    oid = getattr(pytest, "shared_upi_order_id", None)
    assert oid
    r = session.post(
        f"{API}/admin/orders/{oid}/mark-paid",
        headers={"Authorization": f"Bearer {user_token}"},
    )
    assert r.status_code == 403


def test_admin_mark_paid_no_auth():
    oid = getattr(pytest, "shared_upi_order_id", None)
    assert oid
    r = requests.post(f"{API}/admin/orders/{oid}/mark-paid")
    assert r.status_code == 401


def test_admin_mark_paid_success(admin_token):
    oid = getattr(pytest, "shared_upi_order_id", None)
    assert oid
    r = session.post(
        f"{API}/admin/orders/{oid}/mark-paid",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert r.status_code == 200
    assert r.json().get("ok") is True
    # Verify persistence
    g = session.get(f"{API}/orders/{oid}").json()
    assert g["payment_status"] == "paid"
    assert g["status"] == "paid"


def test_admin_mark_paid_unknown_404(admin_token):
    r = session.post(
        f"{API}/admin/orders/{uuid.uuid4()}/mark-paid",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert r.status_code == 404
