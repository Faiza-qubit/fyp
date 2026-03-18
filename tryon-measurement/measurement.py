import cv2
import numpy as np

# A4 paper real dimensions (cm)
A4_WIDTH_CM = 21.0
A4_HEIGHT_CM = 29.7


def get_largest_contour(mask):

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if len(contours) == 0:
        return None

    return max(contours, key=cv2.contourArea)


def order_points(pts):

    rect = np.zeros((4, 2), dtype="float32")

    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]   # top-left
    rect[2] = pts[np.argmax(s)]   # bottom-right

    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]  # top-right
    rect[3] = pts[np.argmax(diff)]  # bottom-left

    return rect


def four_point_transform(image, pts):

    rect = order_points(pts)

    (tl, tr, br, bl) = rect

    widthA = np.linalg.norm(br - bl)
    widthB = np.linalg.norm(tr - tl)

    maxWidth = int(max(widthA, widthB))

    heightA = np.linalg.norm(tr - br)
    heightB = np.linalg.norm(tl - bl)

    maxHeight = int(max(heightA, heightB))

    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")

    M = cv2.getPerspectiveTransform(rect, dst)

    warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))

    return warped


def measure_foot(image, paper_mask, foot_mask):

    # convert masks to proper format
    paper_mask = (paper_mask * 255).astype("uint8")
    foot_mask = (foot_mask * 255).astype("uint8")

    # save masks for debugging
    cv2.imwrite("paper_mask.jpg", paper_mask)
    cv2.imwrite("foot_mask.jpg", foot_mask)

    paper_contour = get_largest_contour(paper_mask)

    if paper_contour is None:
        print("No paper detected")
        return None

    # draw paper contour
    debug_paper = image.copy()
    cv2.drawContours(debug_paper, [paper_contour], -1, (0, 255, 0), 3)
    cv2.imwrite("paper_contour_debug.jpg", debug_paper)

    epsilon = 0.02 * cv2.arcLength(paper_contour, True)
    approx = cv2.approxPolyDP(paper_contour, epsilon, True)

    # If paper contour is not detected as 4 points
    if len(approx) != 4:

        rect = cv2.minAreaRect(paper_contour)
        approx = cv2.boxPoints(rect)
        approx = approx.astype(int)

    pts = approx.reshape(4, 2)

    # perspective transform
    warped = four_point_transform(image, pts)
    warped_mask = four_point_transform(foot_mask, pts)

    cv2.imwrite("warped_paper.jpg", warped)
    cv2.imwrite("warped_foot_mask.jpg", warped_mask)

    foot_contour = get_largest_contour(warped_mask)

    if foot_contour is None:
        print("No foot detected")
        return None

    x, y, w, h = cv2.boundingRect(foot_contour)

    # draw foot contour and bounding box
    debug_foot = warped.copy()

    if len(debug_foot.shape) == 2:
        debug_foot = cv2.cvtColor(debug_foot, cv2.COLOR_GRAY2BGR)

    cv2.drawContours(debug_foot, [foot_contour], -1, (0, 0, 255), 3)
    cv2.rectangle(debug_foot, (x, y), (x + w, y + h), (255, 0, 0), 2)

    cv2.imwrite("foot_contour_debug.jpg", debug_foot)

    # pixel to cm conversion
    pixels_per_cm_x = warped.shape[1] / A4_WIDTH_CM
    pixels_per_cm_y = warped.shape[0] / A4_HEIGHT_CM

    foot_length_cm = h / pixels_per_cm_y
    foot_width_cm = w / pixels_per_cm_x

    print("Foot Length (cm):", round(foot_length_cm, 2))
    print("Foot Width (cm):", round(foot_width_cm, 2))

    return round(foot_length_cm, 2), round(foot_width_cm, 2)


def foot_to_shoe_size(length_cm):

    eu_size = round((length_cm + 1.5) * 1.5)
    valid_eu_sizes = [36, 37, 38, 39, 40, 41, 42, 43, 44]

    if eu_size < 36:
        eu_size = 36
    elif eu_size > 44:
        eu_size = 44

    eu_size = min(valid_eu_sizes, key=lambda x: abs(x - eu_size))

    eu_to_us_chart = {
        36: 5,
        37: 6,
        38: 7,
        39: 8,
        40: 9,
        41: 10,
        42: 11,
        43: 12,
        44: 13
    }

    us_size = eu_to_us_chart[eu_size]

    return eu_size, us_size

