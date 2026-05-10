---
id: hand-gesture-ar
title: RGB-D Hand Gesture Recognition (C++)
category: Research
thumbnail: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800
tags:
  - C++
  - OpenCV
  - TensorFlow
  - Intel RealSense
  - Python
contribution: 85
description: Real-time 21-joint hand skeleton extraction from RGB-D camera at 30fps
role: Researcher (Graduation Thesis)
period: 2018
publication: Inha University Computer Science Graduation Thesis
demoVideo: https://youtu.be/DJrrfm4XU_M
images:
  - url: images/projects/hand-gesture-ar/overview.png
    caption: Hand Gesture Recognition Overview
  - url: images/projects/hand-gesture-ar/process.png
    caption: Recognition Process Pipeline
---

## Responsibilities

- Implemented OpenNI depth stream initialization and resolution/FPS configuration
- Developed depth-first hand segmentation with threshold, noise removal, and hole filling
- Built RGB-Depth alpha blending pipeline for frame composition
- Extracted 21-joint skeleton using Convolutional Pose Machines
- Achieved 91% accuracy with 3x performance improvement (6fps → 18fps)

## About

Graduation thesis project using Intel RealSense SR300 RGB-D camera. Built real-time image processing pipeline targeting 30fps — depth-first segmentation, RGB-Depth alpha blending, and 21-joint skeleton extraction. Normalized joint distance data to handle varying camera distances, improving accuracy to 91%.
