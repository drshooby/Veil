from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from modelsetup import ModelSetup

app = Flask(__name__)
@app.route('/')
def index():
    return 'Hello World!'
# CORS(app)
# docker build -t my-backend-image .
# model = ModelSetup()
#
# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)
#
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8080)


