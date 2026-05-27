"""Upload endpoints — public, used during guest checkout."""

from __future__ import annotations

import re

from fastapi import APIRouter, HTTPException, Request, UploadFile
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

from src.integrations import cloudflare_client

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

_ALLOWED_MIME = {"image/png", "image/jpeg", "image/jpg"}
_ALLOWED_EXT  = {"png", "jpg", "jpeg"}
_MAX_BYTES    = 5 * 1024 * 1024  # 5 MB

_MAGIC: dict[str, bytes] = {
    "png":  b"\x89PNG",
    "jpg":  b"\xff\xd8\xff",
    "jpeg": b"\xff\xd8\xff",
}

# SVG is intentionally excluded — browsers can render embedded <script> in SVGs.
# Customers use PNG/JPG for embroidery artwork; SVG has no practical benefit here.

_SVG_DANGEROUS = re.compile(r"<script|javascript:|on\w+\s*=", re.IGNORECASE)


class UploadResponse(BaseModel):
    url: str


@router.post("/customization", response_model=UploadResponse)
@limiter.limit("10/hour")
async def upload_customization_file(request: Request, file: UploadFile) -> UploadResponse:
    """Upload a customization design file to R2. Public — no auth required."""
    content_type = file.content_type or ""
    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if content_type not in _ALLOWED_MIME and ext not in _ALLOWED_EXT:
        raise HTTPException(status_code=422, detail="Unsupported file type. Use PNG or JPG.")

    data = await file.read()
    if len(data) > _MAX_BYTES:
        raise HTTPException(status_code=422, detail="File exceeds 5 MB limit.")

    # Magic-byte validation — reject files renamed to a different extension
    magic = _MAGIC.get(ext)
    if magic and not data.startswith(magic):
        raise HTTPException(status_code=422, detail="File content does not match the declared format.")

    url = await cloudflare_client.upload_image(data, filename, folder="customizations")
    return UploadResponse(url=url)
