from __future__ import annotations


class DomainError(Exception):
    code = "domain_error"
    status_code = 400


class ResourceNotFoundError(DomainError):
    code = "resource_not_found"
    status_code = 404


class ConflictError(DomainError):
    code = "resource_conflict"
    status_code = 409


class RateLimitExceededError(DomainError):
    code = "rate_limit_exceeded"
    status_code = 429

    def __init__(self, message: str, *, retry_after: int) -> None:
        super().__init__(message)
        self.retry_after = retry_after


class ProviderModeError(DomainError):
    code = "provider_mode_mismatch"
    status_code = 409
