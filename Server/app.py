import os
from flask import request, jsonify, render_template
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from config import app, db
from models import User
from datetime import datetime, timedelta
from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity

app.config['JWT_SECRET_KEY'] = os.urandom(24)  # Change this to a random secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600
jwt = JWTManager(app)

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    return app.send_static_file('index.html')

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    return jsonify({"users": json_users})

# Helper function to create a JWT
def create_jwt(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    }
    return jwt.encode(payload, app.config['JWT_SECRET_KEY'], algorithm='HS256')

# Helper function to verify JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')

        if not token:
            return jsonify({"message": "Token is missing"}), 403

        try:
            decoded = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(decoded['user_id'])
            if not current_user:
                return jsonify({"message": "Invalid token"}), 403
        except:
            return jsonify({"message": "error"}), 403

        return f(current_user, *args, **kwargs)

    return decorated

# Modify the login route to return a JWT
from flask_jwt_extended import create_access_token

@app.route("/login", methods=["POST"])
def login():
    phone_number = request.json.get('phoneNumber')
    password = request.json.get('password')

    if not phone_number or not password:
        return jsonify({"message": "Phone number and password are required"}), 400

    user = User.query.filter_by(contno=phone_number).first()

    if user and user.pwd == password:
        # Create a JWT token for the user using 'create_access_token'
        access_token = create_access_token(identity=user.uid)
        return jsonify({"access_token": access_token, "uid": user.uid, "name": user.first_name}), 200
    else:
        return jsonify({"message": "Invalid phone number or password"}), 401


@app.route("/api/send-money", methods=["POST"])
@jwt_required()  # Protect this route with JWT
def send_money():
    data = request.json
    phone_number = data.get("phoneNumber")
    amount = data.get("amount")
    password = data.get("password")

    # Get the current user's identity from the JWT token
    current_user_contno = get_jwt_identity()
    sender = User.query.filter_by(contno=current_user_contno).first()

    if not sender or sender.pwd != password:
        return jsonify({"message": "Invalid password"}), 401

    if sender.balance < amount:
        return jsonify({"message": "Insufficient balance"}), 400

    receiver = User.query.filter_by(contno=phone_number).first()
    if not receiver:
        return jsonify({"message": "Receiver not found"}), 404

    # Process the transaction
    sender.balance -= amount
    receiver.balance += amount

    db.session.commit()

    return jsonify({"message": "Money sent successfully"}), 200


@app.route("/api/user/<int:uid>", methods=["GET"])
@jwt_required()  # Protect this route
def get_user(uid):
    user = User.query.get(uid)
    if user:
        return jsonify({
            'id': user.uid,
            'name': user.first_name,
            'balance': user.balance
        }), 200
    return jsonify({'error': 'User not found'}), 404

@app.route('/logout', methods=['POST'])
@jwt_required()  # Protect this route
def logout():
    return jsonify({"message": "Logged out successfully"}), 200

@app.route("/create_user", methods=["POST"])
def create_user():
    first_name = request.json.get("firstName")
    contno = request.json.get("contno")
    balance = request.json.get("bal")
    pwd = request.json.get("pwd")

    if not first_name or not balance or not contno or not pwd:
        return jsonify({"message": "You must include all details"}), 400

    new_user = User(first_name=first_name, contno=contno, balance=balance, pwd=pwd) 
    try:
        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message": "User Created"}), 201

@app.route("/admin/delete_user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    admin_password = request.headers.get("admin-password")
    
    if admin_password != "admin123":  # Replace with your admin password logic
        return jsonify({"message": "Unauthorized access"}), 401

    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
