from sqlalchemy import Column, Integer, String, Text
from database import Base


class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    synopsis = Column(Text, nullable=False)
    poster_url = Column(String(500), nullable=False)
