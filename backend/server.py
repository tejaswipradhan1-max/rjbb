from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt as pyjwt
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionResponse,
    CheckoutStatusResponse,
    CheckoutSessionRequest,
)


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_SECRET = os.environ.get('JWT_SECRET', 'rajkumari-fallback-secret')
JWT_ALGO = 'HS256'
JWT_EXP_DAYS = 14
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY', 'sk_test_emergent')
MERCHANT_UPI_ID = os.environ.get('MERCHANT_UPI_ID', 'rajkumari@upi')
MERCHANT_NAME = os.environ.get('MERCHANT_NAME', 'Rajkumari')

app = FastAPI(title="Rajkumari Luxury Spices API")
api_router = APIRouter(prefix="/api")
bearer = HTTPBearer(auto_error=False)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


# ----------------- Models -----------------
def now_iso():
    return datetime.now(timezone.utc).isoformat()


class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserPublic(BaseModel):
    id: str
    name: str
    email: str
    role: str


class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name: str
    hindi_name: str
    tagline: str
    description: str
    price_inr: float
    weight_g: int
    color: str  # spice accent color hex
    image_url: str
    category: str
    stock: int = 100
    featured: bool = True
    created_at: str = Field(default_factory=now_iso)


class ProductCreate(BaseModel):
    slug: str
    name: str
    hindi_name: str
    tagline: str
    description: str
    price_inr: float
    weight_g: int
    color: str
    image_url: str
    category: str
    stock: int = 100
    featured: bool = True


class CartItem(BaseModel):
    product_id: str
    quantity: int


class CheckoutBody(BaseModel):
    items: List[CartItem]
    origin_url: str


class UpiCheckoutBody(BaseModel):
    items: List[CartItem]
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None


class UpiConfirmBody(BaseModel):
    upi_reference: str


class OrderItemSnap(BaseModel):
    product_id: str
    name: str
    price_inr: float
    quantity: int
    image_url: str


class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_email: Optional[str] = None
    items: List[OrderItemSnap]
    total_inr: float
    session_id: Optional[str] = None
    payment_status: str = "pending"
    status: str = "initiated"
    created_at: str = Field(default_factory=now_iso)


# ----------------- Auth helpers -----------------
def hash_password(pw: str) -> str:
    return bcrypt.hashpw(pw.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(pw: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pw.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def create_token(user: dict) -> str:
    payload = {
        'sub': user['id'],
        'email': user['email'],
        'role': user.get('role', 'user'),
        'exp': datetime.now(timezone.utc) + timedelta(days=JWT_EXP_DAYS),
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)):
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = pyjwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({'id': payload['sub']}, {'_id': 0, 'password': 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


async def admin_required(user=Depends(current_user)):
    if user.get('role') != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ----------------- Seed -----------------
SEED_PRODUCTS = [
    {
        "slug": "shuddh-haldi",
        "name": "Rajkumari Shuddh Haldi",
        "hindi_name": "शुद्ध हल्दी",
        "tagline": "Stone-ground golden turmeric from Erode farmlands",
        "description": "Hand-selected Lakadong-grade turmeric, sun-cured and stone-ground in small batches. Unpolished. Unblended. Pure golden lineage in every gram.",
        "price_inr": 449.0,
        "weight_g": 200,
        "color": "#FFB300",
        "image_url": "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/4ama2kfa_WhatsApp%20Image%202026-06-20%20at%2012.39.04.jpeg",
        "category": "single-spice",
        "stock": 120,
        "featured": True,
    },
    {
        "slug": "shuddh-mirchi",
        "name": "Rajkumari Shuddh Mirchi",
        "hindi_name": "शुद्ध मिर्ची",
        "tagline": "Slow stone-ground Guntur red chili",
        "description": "Whole Guntur Sannam chilies, traditionally stone-ground to preserve oils and aroma. A luxurious crimson heat with no artificial color.",
        "price_inr": 499.0,
        "weight_g": 200,
        "color": "#E53935",
        "image_url": "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/0jr7l1id_WhatsApp%20Image%202026-06-20%20at%2012.39.03.jpeg",
        "category": "single-spice",
        "stock": 100,
        "featured": True,
    },
    {
        "slug": "shuddh-dhaniya",
        "name": "Rajkumari Shuddh Dhaniya",
        "hindi_name": "शुद्ध धनिया",
        "tagline": "Cold-ground Rajasthani coriander",
        "description": "Eagle-variety coriander seeds from arid Rajasthan, cold-ground to retain delicate citrus oils. The signature foundation of every royal kitchen.",
        "price_inr": 379.0,
        "weight_g": 250,
        "color": "#827717",
        "image_url": "https://customer-assets.emergentagent.com/job_shuddh-essence/artifacts/55v60azb_WhatsApp%20Image%202026-06-20%20at%2012.39.03%20%281%29.jpeg",
        "category": "single-spice",
        "stock": 150,
        "featured": True,
    },
    {
        "slug": "royal-garam-masala",
        "name": "Royal Garam Masala",
        "hindi_name": "शाही गरम मसाला",
        "tagline": "A 17-spice royal blend",
        "description": "A blend of seventeen whole spices roasted on cast iron and ground on stone. The same composition once reserved for Rajasthan's palace kitchens.",
        "price_inr": 699.0,
        "weight_g": 150,
        "color": "#BF953F",
        "image_url": "https://images.pexels.com/photos/4198656/pexels-photo-4198656.jpeg",
        "category": "blend",
        "stock": 80,
        "featured": True,
    },
]


@app.on_event("startup")
async def seed_db():
    # Seed products
    count = await db.products.count_documents({})
    if count == 0:
        for p in SEED_PRODUCTS:
            doc = Product(**p).model_dump()
            await db.products.insert_one(doc)
        logger.info("Seeded products")
    # Seed admin
    admin = await db.users.find_one({'email': 'admin@rajkumari.in'})
    if not admin:
        user = {
            'id': str(uuid.uuid4()),
            'name': 'Maharaja Admin',
            'email': 'admin@rajkumari.in',
            'password': hash_password('Royal@2026'),
            'role': 'admin',
            'created_at': now_iso(),
        }
        await db.users.insert_one(user)
        logger.info("Seeded admin user")


# ----------------- Routes -----------------
@api_router.get("/")
async def root():
    return {"brand": "Rajkumari", "tagline": "Purity. Heritage. Luxury."}


# --- Auth ---
@api_router.post("/auth/register")
async def register(body: UserRegister):
    existing = await db.users.find_one({'email': body.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = {
        'id': str(uuid.uuid4()),
        'name': body.name,
        'email': body.email.lower(),
        'password': hash_password(body.password),
        'role': 'user',
        'created_at': now_iso(),
    }
    await db.users.insert_one(user)
    token = create_token(user)
    return {
        'token': token,
        'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'role': user['role']},
    }


@api_router.post("/auth/login")
async def login(body: UserLogin):
    user = await db.users.find_one({'email': body.email.lower()})
    if not user or not verify_password(body.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token(user)
    return {
        'token': token,
        'user': {'id': user['id'], 'name': user['name'], 'email': user['email'], 'role': user['role']},
    }


@api_router.get("/auth/me")
async def me(user=Depends(current_user)):
    return user


# --- Products ---
@api_router.get("/products")
async def list_products():
    items = await db.products.find({}, {'_id': 0}).to_list(500)
    return items


@api_router.get("/products/{slug}")
async def get_product(slug: str):
    item = await db.products.find_one({'slug': slug}, {'_id': 0})
    if not item:
        raise HTTPException(status_code=404, detail="Product not found")
    return item


@api_router.post("/products", dependencies=[Depends(admin_required)])
async def create_product(body: ProductCreate):
    p = Product(**body.model_dump())
    await db.products.insert_one(p.model_dump())
    return p.model_dump()


@api_router.delete("/products/{product_id}", dependencies=[Depends(admin_required)])
async def delete_product(product_id: str):
    res = await db.products.delete_one({'id': product_id})
    return {"deleted": res.deleted_count}


# --- Checkout ---
@api_router.post("/checkout/session")
async def create_checkout(body: CheckoutBody, request: Request, creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)):
    if not body.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # Resolve products & compute total server-side
    product_ids = [i.product_id for i in body.items]
    products = await db.products.find({'id': {'$in': product_ids}}, {'_id': 0}).to_list(500)
    pmap = {p['id']: p for p in products}

    total = 0.0
    snap_items: List[Dict] = []
    for it in body.items:
        if it.product_id not in pmap:
            raise HTTPException(status_code=400, detail=f"Invalid product {it.product_id}")
        if it.quantity < 1:
            raise HTTPException(status_code=400, detail="Invalid quantity")
        p = pmap[it.product_id]
        line = float(p['price_inr']) * it.quantity
        total += line
        snap_items.append({
            'product_id': p['id'],
            'name': p['name'],
            'price_inr': float(p['price_inr']),
            'quantity': it.quantity,
            'image_url': p['image_url'],
        })

    total = round(total, 2)

    # Identify user if token present
    user_email = None
    if creds:
        try:
            payload = pyjwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
            user_email = payload.get('email')
        except Exception:
            user_email = None

    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    success_url = f"{body.origin_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{body.origin_url}/cart"

    order_id = str(uuid.uuid4())
    metadata = {'order_id': order_id, 'source': 'rajkumari-web'}
    if user_email:
        metadata['user_email'] = user_email

    checkout_request = CheckoutSessionRequest(
        amount=float(total),
        currency='inr',
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session: CheckoutSessionResponse = await stripe_checkout.create_checkout_session(checkout_request)

    # Save order + payment_transaction
    order_doc = {
        'id': order_id,
        'user_email': user_email,
        'items': snap_items,
        'total_inr': total,
        'session_id': session.session_id,
        'payment_status': 'pending',
        'status': 'initiated',
        'created_at': now_iso(),
    }
    await db.orders.insert_one(order_doc)

    tx_doc = {
        'id': str(uuid.uuid4()),
        'order_id': order_id,
        'session_id': session.session_id,
        'amount': total,
        'currency': 'inr',
        'metadata': metadata,
        'payment_status': 'pending',
        'status': 'initiated',
        'user_email': user_email,
        'created_at': now_iso(),
        'updated_at': now_iso(),
    }
    await db.payment_transactions.insert_one(tx_doc)

    return {'url': session.url, 'session_id': session.session_id, 'order_id': order_id}


@api_router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str, request: Request):
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    status: CheckoutStatusResponse = await stripe_checkout.get_checkout_status(session_id)

    tx = await db.payment_transactions.find_one({'session_id': session_id}, {'_id': 0})
    if tx and tx.get('payment_status') != 'paid':
        await db.payment_transactions.update_one(
            {'session_id': session_id},
            {'$set': {
                'payment_status': status.payment_status,
                'status': status.status,
                'updated_at': now_iso(),
            }},
        )
        await db.orders.update_one(
            {'session_id': session_id},
            {'$set': {
                'payment_status': status.payment_status,
                'status': 'paid' if status.payment_status == 'paid' else status.status,
            }},
        )

    return {
        'session_id': session_id,
        'payment_status': status.payment_status,
        'status': status.status,
        'amount_total': status.amount_total,
        'currency': status.currency,
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request, stripe_signature: Optional[str] = Header(None)):
    body_bytes = await request.body()
    host_url = str(request.base_url)
    webhook_url = f"{host_url}api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    try:
        evt = await stripe_checkout.handle_webhook(body_bytes, stripe_signature)
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return {"ok": False}
    if evt.session_id:
        await db.payment_transactions.update_one(
            {'session_id': evt.session_id},
            {'$set': {'payment_status': evt.payment_status, 'updated_at': now_iso()}},
        )
        await db.orders.update_one(
            {'session_id': evt.session_id},
            {'$set': {'payment_status': evt.payment_status,
                      'status': 'paid' if evt.payment_status == 'paid' else evt.payment_status}},
        )
    return {"ok": True}


# --- Orders ---
@api_router.get("/orders/mine")
async def my_orders(user=Depends(current_user)):
    items = await db.orders.find({'user_email': user['email']}, {'_id': 0}).sort('created_at', -1).to_list(200)
    return items


# --- UPI flow (manual) ---
async def _resolve_cart(items: List[CartItem]):
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    product_ids = [i.product_id for i in items]
    products = await db.products.find({'id': {'$in': product_ids}}, {'_id': 0}).to_list(500)
    pmap = {p['id']: p for p in products}
    total = 0.0
    snap = []
    for it in items:
        if it.product_id not in pmap:
            raise HTTPException(status_code=400, detail=f"Invalid product {it.product_id}")
        if it.quantity < 1:
            raise HTTPException(status_code=400, detail="Invalid quantity")
        p = pmap[it.product_id]
        total += float(p['price_inr']) * it.quantity
        snap.append({
            'product_id': p['id'],
            'name': p['name'],
            'price_inr': float(p['price_inr']),
            'quantity': it.quantity,
            'image_url': p['image_url'],
        })
    return round(total, 2), snap


@api_router.post("/checkout/upi")
async def create_upi_order(body: UpiCheckoutBody, creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer)):
    total, snap = await _resolve_cart(body.items)
    user_email = None
    if creds:
        try:
            payload = pyjwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
            user_email = payload.get('email')
        except Exception:
            user_email = None

    order_id = str(uuid.uuid4())
    short_ref = order_id[:8].upper()
    upi_link = (
        f"upi://pay?pa={urlquote(MERCHANT_UPI_ID, safe='@.')}"
        f"&pn={urlquote(MERCHANT_NAME)}"
        f"&am={total:.2f}&cu=INR&tn={urlquote(f'RJK-{short_ref}')}"
    )

    await db.orders.insert_one({
        'id': order_id,
        'user_email': user_email,
        'items': snap,
        'total_inr': total,
        'payment_method': 'upi',
        'payment_status': 'awaiting_payment',
        'status': 'awaiting_payment',
        'upi_reference': None,
        'upi_short_ref': short_ref,
        'customer_name': body.customer_name,
        'customer_phone': body.customer_phone,
        'created_at': now_iso(),
    })

    return {
        'order_id': order_id,
        'short_ref': short_ref,
        'total_inr': total,
        'merchant_upi_id': MERCHANT_UPI_ID,
        'merchant_name': MERCHANT_NAME,
        'upi_link': upi_link,
        'qr_url': f"https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=10&data={upi_link}",
    }


@api_router.post("/checkout/upi/{order_id}/confirm")
async def confirm_upi(order_id: str, body: UpiConfirmBody):
    order = await db.orders.find_one({'id': order_id}, {'_id': 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if not body.upi_reference or len(body.upi_reference.strip()) < 4:
        raise HTTPException(status_code=400, detail="Invalid UPI reference")
    await db.orders.update_one(
        {'id': order_id},
        {'$set': {
            'upi_reference': body.upi_reference.strip(),
            'payment_status': 'verifying',
            'status': 'verifying',
        }},
    )
    return {'ok': True, 'status': 'verifying'}


@api_router.post("/admin/orders/{order_id}/mark-paid", dependencies=[Depends(admin_required)])
async def mark_order_paid(order_id: str):
    res = await db.orders.update_one(
        {'id': order_id},
        {'$set': {'payment_status': 'paid', 'status': 'paid'}},
    )
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    return {'ok': True}


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user=Depends(current_user)):
    order = await db.orders.find_one({'id': order_id}, {'_id': 0})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    # Only owner (matching email) or admin can read
    if user.get('role') != 'admin' and order.get('user_email') != user.get('email'):
        raise HTTPException(status_code=403, detail="Forbidden")
    return order


@api_router.get("/admin/orders", dependencies=[Depends(admin_required)])
async def admin_orders():
    items = await db.orders.find({}, {'_id': 0}).sort('created_at', -1).to_list(500)
    return items


@api_router.get("/admin/users", dependencies=[Depends(admin_required)])
async def admin_users():
    items = await db.users.find({}, {'_id': 0, 'password': 0}).to_list(500)
    return items


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
