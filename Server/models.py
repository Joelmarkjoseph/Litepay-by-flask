from config import db

class User(db.Model): 
    uid=db.Column(db.Integer, primary_key=True) 
    first_name = db.Column(db.String(80), unique=False, nullable=False)
    contno = db.Column(db.String(120), unique=True, nullable=False)
    balance = db.Column(db.Integer, unique=False, nullable=False)
    pwd = db.Column(db.String(80), unique=False, nullable=False)

    def to_json(self):
        return {
            "uid":self.uid,
            "firstName": self.first_name,
            "contno":self.contno,
            "balance": self.balance,
       } 