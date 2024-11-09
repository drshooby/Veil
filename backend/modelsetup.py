from matplotlib import pyplot as plt
from mtcnn import MTCNN
import cv2

def model_detect(image) -> list:
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    detector = MTCNN()
    faces = detector.detect_faces(image_rgb)
    return faces

def blur(locations, image):
    x, y, width, height = locations['box']
    roi = image[y: y + height, x: x + width]
    blurred = cv2.GaussianBlur(roi, (99, 99), 0)
    image[y: y + height, x: x + width] = blurred
    return image

def convert_video_to_frames(video_name) -> list:
    cap = cv2.VideoCapture(video_name)
    frame_list = []
    while cap.isOpened() and len(frame_list) != 5:
        ret, frame = cap.read()
        if not ret:
            break
        frame_list.append(frame)
    cap.release()
    return frame_list

def apply_blur(video_frames: list) -> list:
    blurred_frames = []
    for frame in video_frames:
        faces = model_detect(frame)
        for face in faces:
            blurred_frames.append(blur(face, frame))
    return blurred_frames

if __name__ == "__main__":

    # image = cv2.imread("person.jpg")
    frames = convert_video_to_frames("test2.mp4")
    v_frames = apply_blur(frames)
    plt.imshow(v_frames[0])
    plt.show()
    # faces = model_detect(image)
    # blur(faces[0], image)
    #
    # plt.imshow(image)
    # plt.show()