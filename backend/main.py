from typing import Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from database import engine, Base, AsyncSessionLocal, get_db
import movie_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        await movie_service.init_db_and_seed(session)

    yield


app = FastAPI(title="Random Movie App API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "app": "Random Movie App API",
        "db": db_status,
    }


@app.get("/api/movies/random")
async def get_random_movie_endpoint(
    exclude_id: Optional[int] = Query(None, description="ID de la película actual a excluir"),
    db: AsyncSession = Depends(get_db)
):
    movie = await movie_service.get_random_movie(db, exclude_id=exclude_id)
    if not movie:
        raise HTTPException(status_code=404, detail="No movies found")
    return {
        "id": movie.id,
        "title": movie.title,
        "synopsis": movie.synopsis,
        "poster_url": movie.poster_url,
    }
