from app import db
from datetime import datetime
import sys

class Data(db.Model):
    __tablename__ = "data"
    id = db.Column(db.Integer, primary_key=True)
    co_2 = db.Column(db.Integer)
    t_voc = db.Column(db.Integer)
    time = db.Column(db.DateTime)

    def __init__(self, *args, **kwargs):
        super(Data, self).__init__(*args, **kwargs)

    def __repr__(self):
        return f'<data id: {self.id}, co_2: {self.co_2}, t_voc: {self.t_voc}, time: {self.time}>'

    def __lt__(self, other):
        return self.co_2 < other.co_2
    
    

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        return 0