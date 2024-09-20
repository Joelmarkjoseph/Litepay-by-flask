from config import db
from models import User

# This script will create all the tables
db.create_all()
print("Database tables created!")
