from flask import Flask, request, jsonify
from flask_cors import CORS
import os

from werkzeug.utils import secure_filename

from modelsetup import ModelSetup

app = Flask(__name__)
CORS(app)

model = ModelSetup()

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return 'Hello World!'

@app.route('/upload', methods=['POST'])
def upload():
    video_file = request.files.get('video_file')
    if not video_file:
        return jsonify({'error': 'No video file'}), 400

    input_filename = secure_filename(video_file.filename)
    input_filepath = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)

    try:
        video_file.save(input_filepath)
        model.set_input_filename(input_filepath)
        model.run_steps(input_filepath)
        return jsonify({'message': 'Input file uploaded successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(input_filepath):
            os.remove(input_filepath)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8080)


