from __future__ import annotations

import pytest
from fastapi import Request

from ag47_radar.api.dependencies import get_client_host, resolve_operator_role
from ag47_radar.config import Settings
from ag47_radar.errors import AuthenticationError, SecurityConfigurationError
from ag47_radar.services.webhooks import validate_webhook_url


def production_settings(**overrides: object) -> Settings:
    return Settings(
        environment="production",
        database_url="sqlite+aiosqlite:///:memory:",
        auto_create_schema=True,
        **overrides,
    )


def test_production_disables_automatic_schema_creation():
    assert production_settings().should_auto_create_schema is False


def test_production_authentication_fails_closed_without_keys():
    with pytest.raises(SecurityConfigurationError):
        resolve_operator_role(production_settings(), "operator")


def test_production_authentication_assigns_least_privilege_role():
    settings = production_settings(operator_api_key="operator", admin_api_key="admin")
    assert resolve_operator_role(settings, "operator") == "operator"
    assert resolve_operator_role(settings, "admin") == "admin"
    with pytest.raises(AuthenticationError):
        resolve_operator_role(settings, "wrong")


def test_forwarded_address_is_used_only_for_trusted_proxy():
    request = Request(
        {
            "type": "http",
            "headers": [(b"x-forwarded-for", b"198.51.100.7")],
            "client": ("10.0.0.10", 443),
        }
    )
    assert get_client_host(request, Settings(trusted_proxy_cidrs="10.0.0.0/8")) == "198.51.100.7"
    assert get_client_host(request, Settings()) == "10.0.0.10"


def test_production_webhooks_require_https_and_allowlisted_host():
    settings = production_settings(webhook_allowed_hosts="hooks.example.com")
    validate_webhook_url("https://hooks.example.com/ag47", settings)
    with pytest.raises(ValueError):
        validate_webhook_url("http://hooks.example.com/ag47", settings)
    with pytest.raises(ValueError):
        validate_webhook_url("https://other.example.com/ag47", settings)
