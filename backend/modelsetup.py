from facenet_pytorch import MTCNN
import cv2
import concurrent.futures
import torch


class ModelSetup:

    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = MTCNN(keep_all=True, device=self.device)
        self.output_path = "final_output_veil.mp4"

    def model_detect(self, image) -> list:
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        boxes, probs = self.model.detect(image_rgb)
        faces = []
        if boxes is not None:
            for i, box in enumerate(boxes):
                faces.append({
                    'box': box,
                    'confidence': probs[i]
                })
        return faces

    def blur(self, locations, image):
        x1, y1, x2, y2 = map(int, locations['box'])
        roi = image[y1:y2, x1:x2]
        blurred = cv2.GaussianBlur(roi, (99, 99), 0)
        image[y1:y2, x1:x2] = blurred
        return image

    def convert_video_to_frames(self, video_name) -> list:
        cap = cv2.VideoCapture(video_name)
        frame_list = []
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_list.append(frame)
        cap.release()
        return frame_list

    def apply_blur(self, frame):
        faces = self.model_detect(frame)
        for face in faces:
            frame = self.blur(face, frame)
        return frame

    def process_frame(self, frame):
        return self.apply_blur(frame)

    def reassemble_blurred_frames(self, video_frames: list):
        first_frame = video_frames[0]
        height, width, _ = first_frame.shape
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        video = cv2.VideoWriter(self.output_path, fourcc, 30.0, (width, height))
        for frame in video_frames:
            video.write(frame)
        video.release()

    def run_steps(self, input_file):
        video_frames = self.convert_video_to_frames(input_file)
        with concurrent.futures.ThreadPoolExecutor() as executor:
            blurred_frames = list(executor.map(self.process_frame, video_frames))
        self.reassemble_blurred_frames(blurred_frames)

if __name__ == "__main__":
    model = ModelSetup()
    model.run_steps(input_file="test2.mp4")