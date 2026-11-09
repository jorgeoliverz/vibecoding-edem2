import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from database import get_db
from models import Movie
import movie_service


async def fake_get_db():
    class FakeSession:
        async def execute(self, statement):
            return 1
    yield FakeSession()


@pytest.mark.asyncio
async def test_health_check_endpoint():
    app.dependency_overrides[get_db] = fake_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert data["db"] == "connected"
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_get_random_movie_endpoint(monkeypatch):
    mock_movie = Movie(
        id=1,
        title="Inception",
        synopsis="Un ladrón profesional entra en el subconsciente.",
        poster_url="https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    )

    async def fake_service_get_random(session, exclude_id=None):
        return mock_movie

    monkeypatch.setattr(movie_service, "get_random_movie", fake_service_get_random)

    app.dependency_overrides[get_db] = fake_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/movies/random")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 1
        assert data["title"] == "Inception"
        assert data["synopsis"] == "Un ladrón profesional entra en el subconsciente."
        assert "poster_url" in data
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_get_random_movie_with_exclude_id(monkeypatch):
    captured_exclude = []

    async def fake_service_get_random(session, exclude_id=None):
        captured_exclude.append(exclude_id)
        return Movie(
            id=2,
            title="Interstellar",
            synopsis="Viaje por un agujero de gusano.",
            poster_url="https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
        )

    monkeypatch.setattr(movie_service, "get_random_movie", fake_service_get_random)

    app.dependency_overrides[get_db] = fake_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/movies/random?exclude_id=1")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == 2
        assert captured_exclude == [1]
    app.dependency_overrides.clear()
