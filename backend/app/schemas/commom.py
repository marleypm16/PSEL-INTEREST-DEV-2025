# app/schemas/common.py
from pydantic import BaseModel, Field, field_validator
import uuid
from typing import Optional
import re

class UserBase(BaseModel):
    
    name: str = Field(..., description="Nome do usuário")
    email: str = Field(..., description="Email do usuário") 

    @field_validator('name')
    @classmethod
    def validar_nome(cls, v: str):
        v = v.strip()
        if len(v) < 2:
            raise ValueError('Nome inválido: deve ter pelo menos 2 caracteres')
            
        if v.isdigit():
            raise ValueError('Nome inválido: não deve conter apenas números')
        return v

    @field_validator('email')
    @classmethod
    def validar_email(cls, v: str):
        v = v.strip().lower()

        email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
        if not re.match(email_regex, v):
            raise ValueError('Email inválido')
        return v

class UserReadSimple(UserBase):
    id: uuid.UUID
    team_id: Optional[uuid.UUID] = None

class TeamBase(BaseModel):
    name: str = Field(..., description="Nome do time")
    leader_id: uuid.UUID = Field(None, description="ID do líder")

    @field_validator('name')
    @classmethod
    def validar_nome_time(cls, v: str):
        v = v.strip()
        if len(v) < 2:
            raise ValueError('Nome do time muito curto: informe pelo menos 2 letras')
        return v

class TeamReadSimple(TeamBase):
    id: uuid.UUID