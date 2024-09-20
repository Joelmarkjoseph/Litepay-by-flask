import os
from flask import request, jsonify
from config import app, db
from models import User

# Hardcoded admin credentials for simplicity
ADMIN_PASSWORD = "admin123"  # This can be improved using proper authentication mechanisms.

@app.route("/users", methods=["GET"])
def get_users():
    users = User.query.all()
    json_users = list(map(lambda x: x.to_json(), users))
    return jsonify({"users": json_users})


@app.route("/create_user", methods=["POST"])
def create_user():
    """Create a new user."""
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
    """Admin can delete a user by ID."""
    admin_password = request.headers.get("admin-password")
    
    # Check if the admin password is correct
    if admin_password != ADMIN_PASSWORD:
        return jsonify({"message": "Unauthorized access"}), 401

    # Query for the user by ID
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        # Delete the user from the database
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
