from matplotlib import pyplot as plt
from mtcnn import MTCNN
import cv2

def model_detect(image) -> list:
    # convert to rgb
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # use MTCNN for facial detection
    # extracts landmarks and bounding boxes
    detector = MTCNN()
    faces = detector.detect_faces(image_rgb)
    return faces

def blur(locations, image):
    x, y, width, height = locations["box"]
    roi = image[y:y + height, x:x + width]
    blurred = cv2.GaussianBlur(roi, (99, 99), 0)
    image[y:y + height, x:x + width] = blurred
    return image

# def convert_video_to_frames(video_name):
#     cap = cv2.VideoCapture(video_name)
#     while cap.isOpened():


if __name__ == "__main__":
    image = cv2.imread("person.jpg")
    faces = model_detect(image)
    blur(faces[0], image)

    plt.imshow(image)
    plt.show()