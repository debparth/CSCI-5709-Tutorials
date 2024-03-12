import logging
from uuid import uuid4
from flask import Flask, jsonify, request, abort



logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s in %(module)s: %(message)s')
logger = logging.getLogger(__name__)


app = Flask(__name__)


# ----------------- User Class ----------------- #
class User:
    users = []

    def __init__(self, email, firstName, user_id=None):
        self.id = user_id if user_id else str(uuid4())
        self.email = email
        self.firstName = firstName
        User.users.append(self)

    @classmethod
    def get_user_by_id(cls, user_id):
        return next((user for user in cls.users if user.id == user_id), None)

    @classmethod
    def update_user(cls, user_id, email=None, firstName=None):
        user = cls.get_user_by_id(user_id)
        if user:
            user.email = email if email is not None else user.email
            user.firstName = firstName if firstName is not None else user.firstName
            return True
        return False

    @classmethod
    def to_json(cls, user):
        return {"id": user.id, "email": user.email, "firstName": user.firstName}

    @classmethod
    def all_users_to_json(cls):
        return [cls.to_json(user) for user in cls.users]


# ----------------- Routes ----------------- #
@app.route('/users', methods=['GET'])
def get_users():
    logger.info("Fetching all users")
    return jsonify({"message": "Users retrieved", "success": True, "users": User.all_users_to_json()}), 200

@app.route('/add', methods=['POST'])
def add_user():
    data = request.json
    if not data or 'email' not in data or 'firstName' not in data:
        logger.error("Failed to add user: Missing email or firstName")
        abort(400, description="Invalid user data. Email and firstName are required.")

    user = User(email=data['email'], firstName=data['firstName'])
    logger.info(f"User added: {user.id}")
    return jsonify({"message": "User added", "success": True, "user": User.to_json(user)}), 201

@app.route('/update/<id>', methods=['PUT'])
def update_user(id):
    data = request.json
    if User.update_user(id, email=data.get('email'), firstName=data.get('firstName')):
        logger.info(f"User updated: {id}")
        return jsonify({"message": "User updated", "success": True}), 200
    else:
        logger.warning(f"User not found for update: {id}")
        abort(404, description="User not found.")

@app.route('/user/<id>', methods=['GET'])
def get_user(id):
    user = User.get_user_by_id(id)
    if user:
        logger.info(f"User retrieved: {id}")
        return jsonify({"success": True, "user": User.to_json(user)}), 200
    else:
        logger.warning(f"User not found: {id}")
        abort(404, description="User not found.")



# ----------------- Error Handlers ----------------- #
@app.errorhandler(400)
def handle_bad_request(e):
    logger.error(f"Bad Request: {e}")
    return jsonify(success=False, message="Bad request. Please check your data."), 400

@app.errorhandler(404)
def handle_not_found(e):
    logger.error(f"Not Found: {e}")
    return jsonify(success=False, message="Resource not found."), 404

@app.errorhandler(500)
def handle_internal_server_error(e):
    logger.error(f"Internal Server Error: {e}", exc_info=True)
    return jsonify(success=False, message="An unexpected error occurred."), 500




if __name__ == "__main__":
    app.run(debug=True)
