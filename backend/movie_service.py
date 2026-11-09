from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from models import Movie

INITIAL_MOVIES = [
    {
        "title": "Inception",
        "synopsis": "Un ladrón profesional entra en el subconsciente de sus objetivos para robar secretos corporativos y recibe la misión de implantar una idea en la mente de un heredero.",
        "poster_url": "https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",
    },
    {
        "title": "Interstellar",
        "synopsis": "Un grupo de astronautas viaja a través de un agujero de gusano espacial en busca de un nuevo hogar habitable para la humanidad.",
        "poster_url": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    },
    {
        "title": "El viaje de Chihiro",
        "synopsis": "Chihiro, una niña de diez años, queda atrapada en un mundo mágico habitado por dioses, brujas y espíritus, y debe trabajar para liberar a sus padres.",
        "poster_url": "https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg",
    },
    {
        "title": "Pulp Fiction",
        "synopsis": "Las vidas de dos mafiosos, la esposa de un gánster, un boxeador en declive y una pareja de atracadores se entrelazan en cuatro historias de violencia y redención.",
        "poster_url": "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    },
    {
        "title": "El Señor de los Anillos: La Comunidad del Anillo",
        "synopsis": "Un humilde hobbit de la Comarca y ocho compañeros emprenden un viaje épico para destruir el poderoso Anillo Único en el Monte del Destino.",
        "poster_url": "https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cDK6.jpg",
    },
    {
        "title": "Parásitos",
        "synopsis": "Toda la familia de Ki-taek está desempleada y se obsesiona con la adinerada familia Park hasta que sus vidas quedan enredadas en un incidente inesperado.",
        "poster_url": "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
    },
]


async def init_db_and_seed(session: AsyncSession):
    count_result = await session.execute(select(func.count(Movie.id)))
    count = count_result.scalar_one()

    if count < len(INITIAL_MOVIES):
        for item in INITIAL_MOVIES:
            existing = await session.execute(select(Movie).where(Movie.title == item["title"]))
            if not existing.scalar_one_or_none():
                session.add(Movie(**item))
        await session.commit()


async def get_random_movie(session: AsyncSession, exclude_id: Optional[int] = None):
    stmt = select(Movie)
    if exclude_id is not None:
        stmt = stmt.where(Movie.id != exclude_id)

    stmt = stmt.order_by(func.random()).limit(1)
    result = await session.execute(stmt)
    movie = result.scalar_one_or_none()

    # Si sólo hubiera 1 película en toda la BD y fue excluida, retornamos esa única opción
    if not movie and exclude_id is not None:
        fallback_stmt = select(Movie).limit(1)
        fallback_res = await session.execute(fallback_stmt)
        movie = fallback_res.scalar_one_or_none()

    return movie
