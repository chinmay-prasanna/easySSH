from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()
metadata = Base.metadata


class Service(Base):
    __tablename__ = "services"
    __table_args__ = {'schema': 'public'} 

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30))
    ip_address = Column(String(50))
    port = Column(Integer)
    
    def __repr__(self):
        return f"{self.name} at {self.ip_address}:{self.port}"


class Key(Base):
    __tablename__ = "keys"
    __table_args__ = {'schema': 'public'} 

    id = Column(Integer, primary_key=True, index=True)
    service_id = Column(Integer, ForeignKey('public.services.id'))
    username = Column(String(30))
    ssh_key_path = Column(String(200))

    def __repr__(self):
        return f"{self.username} - {self.ssh_key_path}"