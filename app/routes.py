from app import app, db
from models import Data
from datetime import datetime,timedelta
from flask import render_template, session, make_response, request
from sqlalchemy.orm import sessionmaker

@app.route('/request/<int:co_2>/<int:t_voc>', methods=['GET'])
def request_data(co_2, t_voc):
    # заменить на нижний
    time = datetime.now()
    hour_add = timedelta(hours=10)
    cur_with_timezone = (time + hour_add).strftime('%Y-%m-%d %H:%M:%S')
    requested_data = Data(co_2=co_2, t_voc=t_voc, time=cur_with_timezone)
    requested_data.save_to_db()
    print(requested_data)
    return('da')

# @app.route('/request_data', methods=['GET'])
# def request_data():
#     co_2 = request.args.get('co_2')
#     t_voc =request.args.get('t_voc')
#     time = datetime.now()
#     hour_add = timedelta(hours=10)
#     cur_with_timezone = (time + hour_add).strftime('%Y-%m-%d %H:%M:%S')
#     requested_data = Data(co_2=co_2, t_voc=t_voc, time=cur_with_timezone)
#     requested_data.save_to_db()
#     print(requested_data)
#     return('da')

# @app.route('/configure_ scheme', methods=['GET'])
# def configure_ scheme():
#      define delation
#      return {'delay':1000},200

@app.route('/', methods=['GET'])
def index():
     return render_template('header.html')

@app.route('/show_chart_co', methods=['GET'])
def show_chart_co():
    return render_template('co.html')

@app.route('/show_chart_tvoc', methods=['GET'])
def show_chart_tvoc():
    return render_template('tvoc.html')

@app.route('/get_data_co/<arr_length>', methods=['GET'])
def get_data_co(arr_length):    
    data = db.session.query(Data).order_by(Data.id.desc()).first()
    response_data = f'[[{int(arr_length) + 1},{data.co_2}]]'
    
    response = make_response(response_data, 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/get_data_tvoc/<arr_length>', methods=['GET'])
def get_data_tvoc(arr_length):    
    data = db.session.query(Data).order_by(Data.id.desc()).first()
    response_data = f'[[{int(arr_length) + 1},{data.t_voc}]]'
    
    response = make_response(response_data, 200)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

@app.route('/get_data_charts', methods=['GET'])
def get_data_charts():    
    chart_type = request.args.get('chart_type')
    start =request.args.get('time_line_start')
    end = request.args.get('time_line_end')
 
    # 
    # from engine import engine
    # Session = sessionmaker(bind=engine)
    # session = Session()
    # res = session.query(Data).filter(Data.time.between(start,end)).all()
    # 


    if chart_type == 'none':
        response = make_response({},200)
    elif chart_type == 'co':
        res = db.session.query(Data).filter(Data.time.between(start,end)).all()

        max_elem = max(res).co_2
        min_elem = min(res).co_2

        for i in range(len(res)):
            res[i] = {'x': i, 'y': res[i].co_2} 

        response = make_response({'type':'CO 2',
                                'max_val':max_elem,
                                'min_val':min_elem,
                                'data_point': res}, 200)
    else:
        res = db.session.query(Data).filter(Data.time.between(start,end)).all()

        for i in range(len(res)):
            res[i] = res[i].t_voc

        max_elem = max(res)
        min_elem = min(res)

        for i in range(len(res)):
            res[i] = {'x': i, 'y': res[i]} 

        response = make_response({'type':'TVOC',
                                'max_val':max_elem,
                                'min_val':min_elem,
                                'data_point': res}, 200)
    
    return response

@app.route('/get_data', methods=['GET'])
def get_data():
    start = request.args.get('time_line_start')
    end = request.args.get('time_line_end')
    
    # #!
    # from engine import engine
    # Session = sessionmaker(bind=engine)
    # session = Session()

    # #!   print(res, max_elem, min_elem)

    res = db.session.query(Data).filter(Data.time.between(start, end)).all()
    for i in range(len(res)):
        res[i] = {'id': res[i].id, 
                   'co': res[i].co_2,
                   'tvoc': res[i].t_voc,
                   'time': res[i].time.strftime('%Y-%m-%d %H:%M:%S')} 
    print(res)
    return {'data': res}, 200

@app.route('/delete_data', methods=['POST'])
def delete_data():
    items_to_remove = request.form.get('removeItems').split(',')
    print(items_to_remove)
 
    # from engine import engine
    # Session = sessionmaker(bind=engine)
    # session = Session()

    for item in items_to_remove:
        res = db.session.query(Data).filter(Data.id == item).first()
        session.delete(res)
    
    session.commit()

    return {}, 200
