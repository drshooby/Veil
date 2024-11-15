import shutil

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

from werkzeug.utils import secure_filename

from modelsetup import ModelSetup

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
PROCESSED_FOLDER = 'processed'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PROCESSED_FOLDER'] = PROCESSED_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

model = ModelSetup()

@app.route('/')
def index():
    return 'Hi! This is a debug route'

@app.route('/upload', methods=['POST'])
def upload():
    video_file = request.files.get('video_file')
    if not video_file:
        return jsonify({'error': 'No video file'}), 400

    input_filename = secure_filename(video_file.filename)
    input_filepath = os.path.join(app.config['UPLOAD_FOLDER'], input_filename)
    output_filepath = os.path.join(app.config['PROCESSED_FOLDER'], "veiled.mp4")

    try:
        video_file.save(input_filepath)
        model.set_input_filename(input_filepath)
        model.run_steps(input_filepath)
        return send_from_directory(
            app.config['PROCESSED_FOLDER'],
            "veiled.mp4",
            as_attachment=True
        )
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(input_filepath):
            os.remove(input_filepath)
        if os.path.exists(output_filepath):
            os.remove(output_filepath)

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=8080)


