from facenet_pytorch import MTCNN
from flask import current_app
import cv2
import concurrent.futures
import torch
import os.path

class ModelSetup:

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = MTCNN(keep_all=True, device=self.device)
        self.input_filename = None
        self.output_path = None

    def set_input_filename(self, input_file):
        self.input_filename = input_file
        self.output_path = os.path.join(current_app.config["PROCESSED_FOLDER"], "veiled.mp4")

    def model_detect(self, image) -> list:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        boxes, probs = self.model.detect(image_rgb)
        faces = []
        if boxes is not None:
            for i, box in enumerate(boxes):
                # really only the bounding box is used for location
                # but confidence is a nice metric to have for debugging
                faces.append({
                    'box': box,
                    'confidence': probs[i]
                })
        return faces

    @staticmethod
    def blur_single_frame(locations, image):
        x1, y1, x2, y2 = map(int, locations['box'])
        roi = image[y1:y2, x1:x2]
        if roi.size == 0:
            return image
        # KERNEL SIZE MUST BE AN ODD NUMBER (note: bigger number (stronger blur) = more processing)
        blurred = cv2.GaussianBlur(roi, (131, 131), 0)
        image[y1:y2, x1:x2] = blurred
        return image

    def apply_blur(self, frame):
        faces = self.model_detect(frame)
        for face in faces:
            # frame only gets updated 'if' something is detected
            frame = self.blur_single_frame(face, frame)
        return frame

    def process_frame(self, frame):
        return self.apply_blur(frame)

    @staticmethod
    def convert_video_to_frames(video_name) -> list:
        cap = cv2.VideoCapture(video_name)
        frame_list = []
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_list.append(frame)
        cap.release()
        return frame_list

    def reassemble_blurred_frames(self, video_frames: list):
        first_frame = video_frames[0]
        height, width, _ = first_frame.shape
        fourcc = cv2.VideoWriter_fourcc(*'mp4v') # might give warning about missing reference, should still work fine
        # 30fps, can make it higher, but it'll take longer to process
        video = cv2.VideoWriter(self.output_path, fourcc, 30.0, (width, height))
        for frame in video_frames:
            video.write(frame)
        video.release()

    def run_steps(self, input_file):
        video_frames = self.convert_video_to_frames(input_file)
        with concurrent.futures.ThreadPoolExecutor() as executor:
            blurred_frames = list(executor.map(self.process_frame, video_frames))
        self.reassemble_blurred_frames(blurred_frames)