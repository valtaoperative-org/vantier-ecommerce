"""Business logic for the users feature slice."""

from __future__ import annotations

import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.core.config import get_settings
from src.core.exceptions import AppException, ConflictException, ForbiddenException, NotFoundException
from src.features.users.models import AdminUser
from src.features.users.schemas import AdminRoleUpdate, AdminUserInvite, SelfRegisterRequest
from src.integrations import resend_client


async def list_admins(db: AsyncSession) -> list[AdminUser]:
    """Return all active admin users."""
    result = await db.execute(
        select(AdminUser).where(AdminUser.is_active.is_(True)).order_by(AdminUser.created_at)
    )
    return list(result.scalars().all())


async def invite_admin(db: AsyncSession, data: AdminUserInvite) -> AdminUser:
    """Create a new admin user invite, provisioning the DB row and sending an invite email.
    
    The user is expected to register via Neon Auth using the link sent to their email.
    """
    existing = await db.execute(
        select(AdminUser).where(func.lower(AdminUser.email) == data.email.lower())
    )
    if existing.scalar_one_or_none() is not None:
        raise ConflictException(f"Admin with email '{data.email}' already exists.")
    
    # Placeholder identity. True linkage happens when Neon Auth returns matching email payload
    obj = AdminUser(
        neon_auth_user_id=f"pending_{uuid.uuid4()}",
        email=data.email,
        role=data.role
    )
    db.add(obj)
    await db.flush()
    await db.refresh(obj)

    # Send invitation email via Resend
    settings = get_settings()
    invite_link = f"{settings.frontend_url}/auth/login?register=true&email={data.email}"
    await resend_client.send_admin_invite(data.email, data.role, invite_link)

    return obj


async def update_role(
    db: AsyncSession, admin_id: uuid.UUID, data: AdminRoleUpdate
) -> AdminUser:
    """Update role for an admin user."""
    result = await db.execute(select(AdminUser).where(AdminUser.id == admin_id))
    obj = result.scalar_one_or_none()
    if obj is None:
        raise NotFoundException(f"AdminUser {admin_id} not found")
        
    obj.role = data.role
    await db.flush()
    await db.refresh(obj)
    return obj


async def deactivate_admin(
    db: AsyncSession, admin_id: uuid.UUID, current_user_id: uuid.UUID
) -> AdminUser:
    """Soft-delete an admin user. Prevents self-deactivation."""
    if admin_id == current_user_id:
        raise AppException("Cannot deactivate your own account")
        
    result = await db.execute(select(AdminUser).where(AdminUser.id == admin_id))
    obj = result.scalar_one_or_none()
    if obj is None:
        raise NotFoundException(f"AdminUser {admin_id} not found")
        
    obj.is_active = False
    await db.flush()
    await db.refresh(obj)
    return obj


async def get_or_create_on_login(
    db: AsyncSession, req: SelfRegisterRequest
) -> AdminUser:
    """Bootstrap function: Create first owner IF table is empty.
    
    WARNING: Only use internally (via seed script).
    """
    # Guard: Count rows
    count_res = await db.execute(select(func.count(AdminUser.id)))
    count = count_res.scalar_one()
    
    if count > 0:
        raise ForbiddenException("Admin table is not empty. Cannot auto-bootstrap owner.")
        
    obj = AdminUser(
        neon_auth_user_id=req.neon_auth_user_id,
        email=req.email,
        role="owner"
    )
    db.add(obj)
    await db.flush()
    await db.refresh(obj)
    return obj
