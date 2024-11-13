# app.py

from flask import Flask, render_template, jsonify, request, send_from_directory, abort
import logging
from logging.handlers import RotatingFileHandler
import os
import random

app = Flask(__name__)

# Set up server-side logging
if not os.path.exists('logs'):
    os.makedirs('logs')

handler = RotatingFileHandler('logs/all_logs.log', maxBytes=100000, backupCount=10)
handler.setLevel(logging.INFO)
formatter = logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
)
handler.setFormatter(formatter)
app.logger.addHandler(handler)

@app.route('/')
def home():
    app.logger.info('Home page accessed.')

    # Path to the documents directory
    documents_dir = os.path.join(app.static_folder, 'documents')

    # Initialize a dictionary to hold categories and their documents
    documents = {}

    # Iterate through each category (subfolder) in documents_dir
    for category in os.listdir(documents_dir):
        category_path = os.path.join(documents_dir, category)
        if os.path.isdir(category_path):
            # List all PDF files in the category
            pdf_files = [f for f in os.listdir(category_path) if f.lower().endswith('.pdf')]
            if pdf_files:
                # Clean category name (replace underscores with spaces)
                clean_category = category.replace('_', ' ')
                documents[clean_category] = pdf_files

    # Path to the videos directory
    videos_dir = os.path.join(app.static_folder, 'videos')

    # List all mp4 files in the videos directory
    video_files = [f for f in os.listdir(videos_dir) if f.endswith('.mp4')]

    if not video_files:
        app.logger.warning('No background videos found in the videos directory.')
        selected_video = None
    else:
        # Randomly select a video
        selected_video = random.choice(video_files)
        app.logger.info(f'Selected background video: {selected_video}')

    return render_template('index.html', background_video=selected_video, documents=documents)

@app.route('/api/contact', methods=['POST'])
def contact():
    data = request.get_json()
    if data:
        name = data.get('name', 'N/A')
        email = data.get('email', 'N/A')
        message = data.get('message', 'N/A')
        app.logger.info(f'Contact Form Submission: Name={name}, Email={email}, Message={message}')
        # Here, you can add functionality to send an email or store the message in a database
        return jsonify({'status': 'success'}), 200
    return jsonify({'status': 'failure'}), 400

# Route to handle PDF downloads (optional if you prefer more control)
@app.route('/download/<category>/<filename>')
def download_file(category, filename):
    documents_dir = os.path.join(app.static_folder, 'documents', category)
    try:
        return send_from_directory(directory=documents_dir, filename=filename, as_attachment=True)
    except FileNotFoundError:
        abort(404)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
